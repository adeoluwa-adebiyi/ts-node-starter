export interface AuthenticationSpec<T>{
    provideAuthentication(): T
}