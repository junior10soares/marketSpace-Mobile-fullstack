import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO;
    setUser: (User: UserDTO) => void
    singIn: (email: string, password: string) => Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: () => Promise<void>;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const [user, setUser] = useState<UserDTO>({} as UserDTO) //Estado que armazena as informações do usuário
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true); // Indicador de carregamento das informações do usuário

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        console.log(token)
    }

    // Salva as informações do usuário e os tokens de autorização no armazenamento local
    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true)
            await storageUserSave(userData);
            await storageAuthTokenSave({ token, refresh_token });
        } catch (error) {
            throw error

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    // Atualiza o perfil do usuário
    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated);
        } catch (error) {
            throw error;
        }
    }

    // Função de login
    async function singIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });
            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    // Carrega as informações do usuário caso esteja logado
    async function loadUserData() { // usuario continua logado
        try {
            setIsLoadingUserStorageData(true);
            const userLogged = await storageUserGet() //busca as inf do usuario logado
            const { token } = await storageAuthTokenGet()//busca as inf do token

            if (token && userLogged) { // se tiver token e usuario
                userAndTokenUpdate(userLogged, token);//coloque as inf do mesmo
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false); //dps q tiver logado tira o loading
        }
    }

    // Função de logout
    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove()//remove o usuario
            await storageAuthTokenRemove();//remove o token
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    // Carrega as informações do usuário ao iniciar o contexto
    useEffect(() => {
        loadUserData()
    }, [])

    // Define a interceptação de tokens para renovar o token de autorização
    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);

        return () => {
            subscribe();
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            singIn,
            isLoadingUserStorageData,
            updateUserProfile,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}