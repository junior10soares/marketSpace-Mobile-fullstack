import axios, { AxiosError, AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";

type SignOut = () => void;

type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
    baseURL: 'http://192.168.15.156:3333',
}) as APIInstanceProps;

let failedQueued: Array<PromiseType> = [];
let isRefreshing = false;

// Registra a função de interceptação de token no objeto 'api'
api.registerInterceptTokenManager = singOut => {
    // Intercepta as respostas das requisições
    const interceptTokenManager = api.interceptors.response.use((response) => response, async (requestError) => {
        // Verifica se o status da resposta é 401 (Não autorizado)
        if (requestError.response?.status === 401) {
            // Verifica se o token expirou ou é inválido
            if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
                // Obtém o refresh token do armazenamento local
                const { refresh_token } = await storageAuthTokenGet();

                // Se não houver refresh token, desconecta o usuário
                if (!refresh_token) {
                    singOut();
                    return Promise.reject(requestError)
                }

                // Salva a configuração original da requisição
                const originalRequestConfig = requestError.config;

                // Verifica se há uma atualização de token em andamento
                if (isRefreshing) {
                    // Adiciona a requisição atual à fila de requisições pendentes
                    return new Promise((resolve, reject) => {
                        failedQueued.push({
                            onSuccess: (token: string) => {
                                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` };
                                resolve(api(originalRequestConfig));
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error)
                            },
                        })
                    })
                }

                // Inicia o processo de atualização de token
                isRefreshing = true;

                // Realiza a requisição para obter um novo token usando o refresh token
                return new Promise(async (resolve, reject) => {
                    try {
                        const { data } = await api.post('/sessions/refresh-token', { refresh_token });
                        await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token });

                        // Converte a string de dados para JSON, se houver dados na requisição original
                        if (originalRequestConfig.data) {
                            originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
                        }

                        // Atualiza o cabeçalho da requisição com o novo token
                        originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                        // Executa as requisições pendentes que estavam na fila
                        failedQueued.forEach(request => {
                            request.onSuccess(data.token);
                        });

                        console.log("TOKEN ATUALIZADO");

                        resolve(api(originalRequestConfig));
                    } catch (error: any) {
                        console.log(error)
                        // Trata as requisições pendentes que estavam na fila
                        failedQueued.forEach(request => {
                            request.onFailure(error);
                        })

                        // Desconecta o usuário em caso de erro
                        singOut();
                        reject(error);
                    } finally {
                        // Finaliza o processo de atualização de token
                        isRefreshing = false;
                        failedQueued = []
                    }
                })
            }

            // Desconecta o usuário se o token estiver inválido ou expirado
            singOut();
        }

        // Retorna um erro personalizado ou o erro da requisição
        if (requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message))
        } else {
            return Promise.reject(requestError)
        }
    });

    // Retorna a função para remover o interceptor, se necessário
    return () => {
        api.interceptors.response.eject(interceptTokenManager);
    }
}

export { api };
