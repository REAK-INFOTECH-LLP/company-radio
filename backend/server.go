package main

import (
    "github.com/ambelovsky/gosf"
    "fmt"
    "time"
    "os"
    "os/exec"
    "encoding/csv"
    "math/rand"
    "log"
    "strings"
    "github.com/dannav/hhmmss"
    "encoding/json"
    "strconv"
)

var playbackData string = "Dummy Data"

func selectTrack() []string {
    file, err := os.Open("tracks.csv")
    if err != nil {
        fmt.Println(err)
    }
    reader := csv.NewReader(file)
    records, _ := reader.ReadAll()

    rand.Seed(time.Now().UnixNano())
    var indexnum int = rand.Intn(len(records))
    return records[indexnum]
}

func trackInfo(ytUrl string) []string {
    out, err := exec.Command("youtube-dl", "--get-url", "--get-thumbnail", "--get-duration", "--get-title", "-f", "140", ytUrl).Output()
    if err != nil {
        log.Fatal(err)
    }
    output := string(out)
    data := strings.Split(output, "\n")
    /*
    [0] -- Title
    [1] -- Playback URL
    [2] -- Thumbnail
    [3] -- Duration
    */
    return data
}

func playback(client *gosf.Client, request *gosf.Request) *gosf.Message {
    fmt.Println("Playback Request Served")
    response := new(gosf.Message)
    response.Success = true
    response.Text = playbackData
    return response
}

func init() {
    // Start goroutine for the radio
    //go startRadio()
    go gosf.Listen("playback", playback)
    go startRadio()
}

func startRadio() {
    for {
        track := selectTrack()
        trackDetails := trackInfo(track[0])
        trackDetails = append(trackDetails, track[1], strconv.FormatInt(time.Now().Unix(),10))
        message := new(gosf.Message)
        message.Success = true
        text, err := json.Marshal(trackDetails)
        playbackData = string(text)
        message.Text = playbackData
        dur, err := hhmmss.Parse(trackDetails[3])
        if err != nil {
            dur = 5
        }
        gosf.Broadcast("", "example", message)
        fmt.Println("Broadcast Update -- " + strconv.FormatInt(time.Now().Unix(), 10))
        time.Sleep(dur)
    }
}

func main() {
    // Start the server using a basic configuration
    gosf.Startup(map[string]interface{}{"port": 9999})
}
