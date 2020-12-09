FROM golang:1.15.6-buster

RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
RUN chmod +x /usr/local/bin/youtube-dl
RUN git clone https://github.com/REAK-INFOTECH-LLP/company-radio.git
WORKDIR company-radio
RUN go build backend/server.go
RUN chmod +x server
EXPOSE 9999
CMD ./server
