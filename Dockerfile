FROM golang:1.15.6-buster

RUN git clone https://github.com/REAK-INFOTECH-LLP/company-radio.git
WORKDIR company-radio
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp
RUN go build backend/server.go
RUN chmod +x server
EXPOSE 9999
CMD ./server
