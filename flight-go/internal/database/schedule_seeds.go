package database

import (
	"fmt"

	"github.com/mirahekatiket/flight-go/internal/models"
)

// Airline configurations
type airlineConfig struct {
	ID              string
	Code            string
	FlightPrefix    string
	Aircraft        string
	Terminal        string
	EconomyPrice    float64
	BusinessPrice   float64
	FirstClassPrice float64
	EconomySeats    int
	BusinessSeats   int
	FirstClassSeats int
}

var airlines = []airlineConfig{
	{ID: "ga", Code: "GA", FlightPrefix: "GA", Aircraft: "Boeing 737-800", Terminal: "3", EconomyPrice: 1.0, BusinessPrice: 3.0, FirstClassPrice: 6.0, EconomySeats: 150, BusinessSeats: 30, FirstClassSeats: 10},
	{ID: "jt", Code: "JT", FlightPrefix: "JT", Aircraft: "Boeing 737-900ER", Terminal: "1B", EconomyPrice: 0.8, BusinessPrice: 2.2, FirstClassPrice: 0, EconomySeats: 180, BusinessSeats: 20, FirstClassSeats: 0},
	{ID: "qg", Code: "QG", FlightPrefix: "QG", Aircraft: "Airbus A320", Terminal: "2", EconomyPrice: 0.7, BusinessPrice: 0, FirstClassPrice: 0, EconomySeats: 180, BusinessSeats: 0, FirstClassSeats: 0},
	{ID: "id", Code: "ID", FlightPrefix: "ID", Aircraft: "Airbus A320", Terminal: "1A", EconomyPrice: 0.75, BusinessPrice: 2.0, FirstClassPrice: 0, EconomySeats: 156, BusinessSeats: 24, FirstClassSeats: 0},
	{ID: "iu", Code: "IU", FlightPrefix: "IU", Aircraft: "Boeing 737-500", Terminal: "1B", EconomyPrice: 0.65, BusinessPrice: 0, FirstClassPrice: 0, EconomySeats: 132, BusinessSeats: 0, FirstClassSeats: 0},
	{ID: "qz", Code: "QZ", FlightPrefix: "QZ", Aircraft: "Airbus A320", Terminal: "2", EconomyPrice: 0.72, BusinessPrice: 0, FirstClassPrice: 0, EconomySeats: 180, BusinessSeats: 0, FirstClassSeats: 0},
}

// Route configurations
type routeConfig struct {
	From            string
	FromCode        string
	To              string
	ToCode          string
	Duration        int
	BasePrice       float64
	DepartTerminals map[string]string
	ArriveTerminals map[string]string
}

var routes = []routeConfig{
	{
		From: "cgk", FromCode: "CGK", To: "dps", ToCode: "DPS", Duration: 150, BasePrice: 800000,
		DepartTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "I", "jt": "D", "qg": "D", "id": "D", "iu": "D", "qz": "D"},
	},
	{
		From: "dps", FromCode: "DPS", To: "cgk", ToCode: "CGK", Duration: 150, BasePrice: 820000,
		DepartTerminals: map[string]string{"ga": "I", "jt": "D", "qg": "D", "id": "D", "iu": "D", "qz": "D"},
		ArriveTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
	},
	{
		From: "cgk", FromCode: "CGK", To: "sub", ToCode: "SUB", Duration: 90, BasePrice: 600000,
		DepartTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "1", "jt": "2", "qg": "2", "id": "2", "iu": "2", "qz": "2"},
	},
	{
		From: "sub", FromCode: "SUB", To: "cgk", ToCode: "CGK", Duration: 90, BasePrice: 620000,
		DepartTerminals: map[string]string{"ga": "1", "jt": "2", "qg": "2", "id": "2", "iu": "2", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
	},
	{
		From: "cgk", FromCode: "CGK", To: "jog", ToCode: "JOG", Duration: 60, BasePrice: 450000,
		DepartTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "", "jt": "", "qg": "", "id": "", "iu": "", "qz": ""},
	},
	{
		From: "jog", FromCode: "JOG", To: "cgk", ToCode: "CGK", Duration: 60, BasePrice: 470000,
		DepartTerminals: map[string]string{"ga": "", "jt": "", "qg": "", "id": "", "iu": "", "qz": ""},
		ArriveTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
	},
	{
		From: "cgk", FromCode: "CGK", To: "kno", ToCode: "KNO", Duration: 120, BasePrice: 700000,
		DepartTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "", "jt": "", "qg": "", "id": "", "iu": "", "qz": ""},
	},
	{
		From: "kno", FromCode: "KNO", To: "cgk", ToCode: "CGK", Duration: 120, BasePrice: 720000,
		DepartTerminals: map[string]string{"ga": "", "jt": "", "qg": "", "id": "", "iu": "", "qz": ""},
		ArriveTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
	},
	{
		From: "dps", FromCode: "DPS", To: "sub", ToCode: "SUB", Duration: 75, BasePrice: 550000,
		DepartTerminals: map[string]string{"ga": "I", "jt": "D", "qg": "D", "id": "D", "iu": "D", "qz": "D"},
		ArriveTerminals: map[string]string{"ga": "1", "jt": "2", "qg": "2", "id": "2", "iu": "2", "qz": "2"},
	},
	{
		From: "sub", FromCode: "SUB", To: "dps", ToCode: "DPS", Duration: 75, BasePrice: 570000,
		DepartTerminals: map[string]string{"ga": "1", "jt": "2", "qg": "2", "id": "2", "iu": "2", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "I", "jt": "D", "qg": "D", "id": "D", "iu": "D", "qz": "D"},
	},
	{
		From: "cgk", FromCode: "CGK", To: "upg", ToCode: "UPG", Duration: 135, BasePrice: 850000,
		DepartTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
		ArriveTerminals: map[string]string{"ga": "", "jt": "", "qg": "", "id": "", "iu": "", "qz": ""},
	},
	{
		From: "upg", FromCode: "UPG", To: "cgk", ToCode: "CGK", Duration: 135, BasePrice: 870000,
		DepartTerminals: map[string]string{"ga": "", "jt": "", "qg": "", "id": "", "iu": "", "qz": ""},
		ArriveTerminals: map[string]string{"ga": "3", "jt": "1B", "qg": "2", "id": "1A", "iu": "1B", "qz": "2"},
	},
}

// Flight time slots - 2 flights per airline per route
var timeSlots = [][]string{
	{"06:00", "08:00"}, // Morning flights
	{"14:00", "18:00"}, // Afternoon/Evening flights
}

// generateSchedules creates comprehensive schedule seeds
func generateSchedules(env string) []models.Schedule {
	var schedules []models.Schedule
	flightCounter := 1

	for _, route := range routes {
		for _, airline := range airlines {
			// Generate 2 flights per airline per route
			for slotIdx, times := range timeSlots {
				departTime := times[0]
				arriveTime := times[1]

				// Calculate arrival time based on duration
				departHour := (departTime[0]-'0')*10 + (departTime[1] - '0')
				departMin := (departTime[3]-'0')*10 + (departTime[4] - '0')
				totalMinutes := int(departHour)*60 + int(departMin) + route.Duration
				arriveHour := totalMinutes / 60
				arriveMin := totalMinutes % 60
				if arriveHour >= 24 {
					arriveHour -= 24
				}
				arriveTime = fmt.Sprintf("%02d:%02d", arriveHour, arriveMin)

				// Calculate prices based on base price and airline multiplier
				economyPrice := route.BasePrice * airline.EconomyPrice
				businessPrice := route.BasePrice * airline.BusinessPrice
				firstClassPrice := route.BasePrice * airline.FirstClassPrice

				// Generate flight number
				flightNum := fmt.Sprintf("%s%d", airline.FlightPrefix, 100+(flightCounter%900))
				scheduleID := fmt.Sprintf("schedule-%s-%s-%s-%03d", route.From, route.To, airline.ID, slotIdx+1)

				schedule := models.Schedule{
					BaseModel:          models.BaseModel{ID: scheduleID},
					AirlineID:          airline.ID,
					FlightNumber:       getName(flightNum, env),
					DepartureAirportID: route.From,
					DepartureTerminal:  route.DepartTerminals[airline.ID],
					DepartureTime:      departTime,
					ArrivalAirportID:   route.To,
					ArrivalTerminal:    route.ArriveTerminals[airline.ID],
					ArrivalTime:        arriveTime,
					Duration:           route.Duration,
					Aircraft:           airline.Aircraft,
					DaysOfWeek:         "1,2,3,4,5,6,7",
					EconomyPrice:       economyPrice,
					BusinessPrice:      businessPrice,
					FirstClassPrice:    firstClassPrice,
					EconomySeats:       airline.EconomySeats,
					BusinessSeats:      airline.BusinessSeats,
					FirstClassSeats:    airline.FirstClassSeats,
					IsActive:           true,
				}

				schedules = append(schedules, schedule)
				flightCounter++
			}
		}
	}

	return schedules
}
