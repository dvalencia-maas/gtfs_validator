const GtfsRealtimeBindings = require("gtfs-realtime-bindings-transit");
const axios = require("axios");

const requestSettings = {
  method: "GET",
  url: "https://gtfs.api.moovia.co/rt/positions",
  responseType: "arraybuffer",
};

async function fetchGtfsRealtimeData() {
  try {
    const response = await axios(requestSettings);
    // console.log("Response received", response.data);
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      response.data
    );
    console.log("Feed Header:", feed.header);
    console.log("Number of Entities:", feed.entity.length);
    feed.entity.forEach((entity) => {
      console.log("Entity ID:", entity);
    });
  } catch (error) {
    console.error(error);
  }
}

fetchGtfsRealtimeData();
