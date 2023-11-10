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

var playbackData []string
var connectedClients int

func selectTrack() []string {
    file, err := os.Open("tracks.csv")
    if err != nil {
        fmt.Println(err)
    }
    reader := csv.NewReader(file)
    records, _ := reader.ReadAll()

    rand.Seed(time.Now().UnixNano())
    var indexnum int = rand.Intn(len(records))
    fmt.Println("Queueing "+strconv.Itoa(indexnum))
    return records[indexnum]
}

func trackInfo(ytUrl string) []string {
    out, err := exec.Command("./yt-dlp", "--rm-cache-dir", "--get-url", "--get-thumbnail", "--get-duration", "--get-title", "-f", "140", ytUrl).Output()
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
    data := append(playbackData, strconv.Itoa(connectedClients))
    res, err := json.Marshal(data)
    response := new(gosf.Message)
    if err != nil {
        response.Success = false
        response.Text = "Failed"
    } else {
        response.Success = true
        response.Text = string(res)
    }
    return response
}

func init() {
    // Start goroutine for the radio
    //go startRadio()
    gosf.Listen("playback", playback)
    gosf.OnConnect(func(client *gosf.Client, request *gosf.Request) {
        connectedClients++
        fmt.Println("Total Clients "+strconv.Itoa(connectedClients))
        message := new(gosf.Message)
        message.Success = true
        message.Text = string(strconv.Itoa(connectedClients))
        gosf.Broadcast("", "clientUpdate", message)
    })
    gosf.OnDisconnect(func(client *gosf.Client, request *gosf.Request) {
        if(connectedClients > 1) {
            connectedClients--
        }
        fmt.Println("Total Clients "+strconv.Itoa(connectedClients))
        message := new(gosf.Message)
        message.Success = true
        message.Text = string(strconv.Itoa(connectedClients))
        gosf.Broadcast("", "clientUpdate", message)
    })
    go startRadio()
}

func startRadio() {
    for {
        track := selectTrack()
        trackDetails := trackInfo(track[0])
        fmt.Println("Fetched Info : "+trackDetails[0])
        trackDetails = append(trackDetails, track[1], strconv.FormatInt(time.Now().Unix(),10))
        playbackData = trackDetails
        trackDetails = append(trackDetails, strconv.Itoa(connectedClients))
        message := new(gosf.Message)
        message.Success = true
        data, err := json.Marshal(trackDetails)
        message.Text = string(data)
        dur, err := hhmmss.Parse(trackDetails[3])
        if err != nil {
            dur = 5
        }
        fmt.Println("Broadcast Update -- " + strconv.FormatInt(time.Now().Unix(), 10))
        time.Sleep(dur)
    }
}

func main() {
    // Start the server using a basic configuration
    var port int
    val, ok := os.LookupEnv("PORT")
    if !ok {
        port = 9999
    } else {
        port,_  = strconv.Atoi(val)
    }
    gosf.Startup(map[string]interface{}{"port": port})
}
