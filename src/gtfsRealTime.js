const GtfsRealtimeBindings = require("gtfs-realtime-bindings-transit");
const axios = require("axios");
const fs = require("fs");

const requestSettings = {
  method: "GET",
  url: "https://gtfs.api.moovia.co/rt/positions",
  responseType: "arraybuffer",
};

async function fetchGtfsRealtimeData() {
  try {
    const initTime = new Date();
    const response = await axios(requestSettings);

    const endTime = new Date();
    // console.log("Response received", response.data);
    let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      response.data
    );
    feed = JSON.parse(JSON.stringify(feed));
    // console.log("Feed Header:", feed.header);
    // console.log("Number of Entities:", feed.entity.length);
    const entities = feed.entity.map((entity) => {
      if (entity.vehicle?.position) {
        entity.vehicle.position.full = `${entity.vehicle.position.latitude},${entity.vehicle.position.longitude}`;
      }
      if (entity.vehicle.timestamp)
        entity.vehicle.timestamptransformed = new Date(
          entity.vehicle.timestamp * 1000 - 5 * 60 * 60 * 1000
        ).toISOString();
      entity.vehicle.initTime = initTime.toISOString();
      entity.vehicle.endTime = endTime.toISOString();
      return entity;
    });
    // write entities to a file
    fs.writeFileSync(
      "./files/gtfs_realtime_entities.json",
      JSON.stringify(entities, null, 2)
    );

    console.log("Entities written to gtfs_realtime_entities.json");
  } catch (error) {
    console.error(error);
  }
}

fetchGtfsRealtimeData();
