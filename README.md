# Company Radio

The idea for this application was born out of a challenge given to the employees of the company as a hackathon project which was to build a radio service but without the use of a streaming server.

The problem with streaming server is that they are expensive to own and operate because of the bandwidth usage and storage, and it's too easy for someone to do. Copyright management is another issue in itself.
So we decided to come up with the next best thing, stream from a popular platform (youtube ofc) but make it so it feels and operates like a radio ie., all the people connected are listening to the same part of the same track like a radio duh !
Hence this project was born.

### Technical Details

The project uses youtube-dl behind the scenes to pull out the audio URL of the highest quality which is served over websockets and individually played on all clients.
The server is written on golang and hosted with Heroku. Heroku was a good choice as it can automatically turn off / pause the instance when nobody is connected and boot it again when someone connects preserving the invaluable resources when not needed.
Server picks up a random track from a CSV file (track.csv) and pulls it's audio URL using youtube-dl, which is then served over websockets and the server sleeps for the duration of the song before repeating the same step.

The UI is mostly vanilla JS along with HTML, It handles communication with server like switching tracks and syncing playback.


### Adding your tracks

We encourage people listening to this, to add their track. The track.csv file follows a very simple syntax
`"Youtube URL","Your Name"`

Because of license restrictions, some songs especially Vevo will not work properly and result in audio URL throwing 403 for clients. It's recommended that you pick up lyrical videos or fan uploaded videos which have good quality instead of the official channel.

Make changes to the track.csv file and send a PR to merge them into it. As soon as the changes are merged the backend will get updated and new tracks will be queueud up.
