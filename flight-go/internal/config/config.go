package config

import (
	"os"
	"time"
)

type Config struct {
	ServerPort             string
	DatabasePath           string // Legacy, for backwards compatibility
	StagingDatabasePath    string
	ProductionDatabasePath string
	JWTSecret              string
	JWTExpiration          time.Duration
	AdminEmail             string
	AdminPassword          string
}

func Load() *Config {
	return &Config{
		ServerPort:             getEnv("SERVER_PORT", "8080"),
		DatabasePath:           getEnv("DATABASE_PATH", "flight.db"),
		StagingDatabasePath:    getEnv("STAGING_DATABASE_PATH", "staging.db"),
		ProductionDatabasePath: getEnv("PRODUCTION_DATABASE_PATH", "production.db"),
		JWTSecret:              getEnv("JWT_SECRET", "your-super-secret-key-change-in-production"),
		JWTExpiration:          24 * time.Hour,
		AdminEmail:             getEnv("ADMIN_EMAIL", "admin@tiket.com"),
		AdminPassword:          getEnv("ADMIN_PASSWORD", "admin123"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
