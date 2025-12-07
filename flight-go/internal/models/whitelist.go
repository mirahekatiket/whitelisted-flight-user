package models

import (
	"strings"
	"time"

	"gorm.io/gorm"
)

type WhitelistedUser struct {
	ID                string         `gorm:"type:varchar(36);primaryKey" json:"id"`
	Email             string         `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	Name              string         `gorm:"type:varchar(255);not null" json:"name"`
	EnabledAirlines   string         `gorm:"type:text" json:"-"`        // Stored as comma-separated IDs
	EnabledAirlineIDs []string       `gorm:"-" json:"enabled_airlines"` // For JSON response
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	DeletedAt         gorm.DeletedAt `gorm:"index" json:"-"`
}

func (WhitelistedUser) TableName() string {
	return "whitelisted_users"
}

// AfterFind populates the EnabledAirlineIDs from the EnabledAirlines string
func (w *WhitelistedUser) AfterFind(tx *gorm.DB) (err error) {
	if w.EnabledAirlines != "" {
		w.EnabledAirlineIDs = strings.Split(w.EnabledAirlines, ",")
	} else {
		w.EnabledAirlineIDs = []string{}
	}
	return nil
}
