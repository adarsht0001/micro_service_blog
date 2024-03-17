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

		reader := bytes.NewReader(eventJSON)

		http.Post("http://localhost:3000/events", "application/json", reader) //post service
		http.Post("http://localhost:3001/events", "application/json", reader) //comment service
		http.Post("http://localhost:3002/events", "application/json", reader) //query service

	}

}

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/events", eventHandler)
	fmt.Println("Server Starting...")
	http.ListenAndServe(":4000", nil)
}
