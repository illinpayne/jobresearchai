export interface AppConfig {
	port: number
	host: string
	allowed_origins: string
	node_env: string
	cookie_domain: string
	cookie_secret: string
	cookie_expire_ttl: number
}
