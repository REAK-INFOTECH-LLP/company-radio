FROM golang:1.15.6-buster

RUN curl -o /usr/local/bin/youtube-dl https://github.com/ytdl-org/youtube-dl/releases/download/2020.12.09/youtube-dl

RUN git clone https://github.com/REAK-INFOTECH-LLP/company-radio.git
WORKDIR company-radio
RUN go build backend/server.go
RUN chmod +x server
RUN ./server
