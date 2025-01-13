import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg mt-10 mb-4">Places to Visit</h2>
      <div>
        {trip?.tripData?.itinerary?.map((item, dayIndex) => (
          <div key={`day-${dayIndex}`}>
            <h2 className="font-medium text-lg capitalize mt-5">
              For {item.day}
            </h2>
            <div>
              {item?.plan?.map((info, planIndex) => (
                <div key={`plan-${dayIndex}-${planIndex}`}>
                  <h2 className="mb-2 font-semibold text-orange-600">
                    Timings: {info.best_time_to_visit}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {info?.places?.map((place, placeIndex) => (
                      <div key={`place-${dayIndex}-${planIndex}-${placeIndex}`} className="my-3">
                        <PlaceCardItem place={place} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
