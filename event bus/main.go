package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>Hello World</h1>")
}

type Event struct {
	Type string
	Data struct {
		ID      string
		Title   string
		Content string
		PostID  string
	}
}

var eventHistory []Event

func eventHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	if r.Method == "POST" {

		var event Event
		decoder := json.NewDecoder(r.Body)
		defer r.Body.Close()
		if err := decoder.Decode(&event); err != nil {
			log.Println("Error decoding JSON:", err)
			return
		}
		eventJSON, err := json.Marshal(event)
		if err != nil {
			log.Println("Error decoding JSON:", err)
			return
		}

		eventHistory = append(eventHistory, event)

		services := []string{"http://localhost:3000/events", "http://localhost:3001/events", "http://localhost:3002/events"}

		for _, url := range services {
			copyData := make([]byte, len(eventJSON))
			copy(copyData, eventJSON)
			copyReader := bytes.NewReader(copyData)
			err, res := http.Post(url, "application/json", copyReader)
			if err != nil {
				fmt.Println("Error posting to", url, err)
			}
			fmt.Println(res)
		}
	}
	if r.Method == "GET" {
		eventJSON, err := json.Marshal(eventHistory)
		if err != nil {
			log.Println("Error decoding JSON:", err)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(eventJSON)
	}
}

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/events", eventHandler)
	fmt.Println("Server Starting...")
	http.ListenAndServe(":4000", nil)
}
