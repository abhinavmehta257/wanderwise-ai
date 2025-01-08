import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Hero from "./components/hero";
import Itinerary from "./components/Itinerary";

const plan = {
  "overview": {
    "destination": "Goa, India",
    "description": "A popular tourist destination known for its stunning beaches, vibrant nightlife, and rich cultural heritage.",
    "trip_duration": "7 days",
    "start_date": "09/01/2025",
    "end_date": "15/01/2025"
  },
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Goa",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Arrival at Goa International Airport (Dabolim)",
          "details": "Fly into Goa and proceed to your accommodation in North Goa. Check-in and refresh.",
          "recommendations": {
            "accommodations": [
              {
                "name": "Taj Exotica Resort & Casino",
                "type": "Luxury",
                "price": "$$$"
              },
              {
                "name": "Lemon Tree Hotel, Candolim Beach",
                "type": "Mid-Range",
                "price": "$$"
              },
              {
                "name": "Zostel Goa",
                "type": "Budget",
                "price": "$"
              }
            ],
            "restaurants": [
              {
                "name": "Gunpowder",
                "cuisine": "Indian",
                "price": "$$"
              },
              {
                "name": "Fisherman’s Wharf",
                "cuisine": "Seafood",
                "price": "$$"
              }
            ],
            "activities": []
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at Fisherman’s Wharf",
          "details": "Enjoy delicious seafood with a Goan twist.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Relax at Calangute Beach",
          "details": "Spend the evening sunbathing or walking on the beach.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": [
              {
                "name": "Parasailing",
                "price": "$$"
              }
            ]
          }
        }
      ]
    },
    {
      "day": 2,
      "title": "Beach Hopping",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Visit Anjuna Beach",
          "details": "Popular beach known for its vibrant ambiance and flea market on Wednesdays.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [
              {
                "name": "Artjuna Cafe",
                "cuisine": "Café",
                "price": "$$"
              }
            ],
            "activities": [
              {
                "name": "Visit Anjuna Flea Market",
                "price": "Free"
              }
            ]
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at Artjuna Cafe",
          "details": "A perfect place for healthy food and juices.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Sunset at Vagator Beach",
          "details": "Enjoy the breathtaking sunset views along with some music and party atmosphere.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [
              {
                "name": "Thalassa",
                "cuisine": "Greek",
                "price": "$$"
              },
              {
                "name": "The Fisherman’s Wharf",
                "cuisine": "Seafood",
                "price": "$$"
              }
            ],
            "activities": [
              {
                "name": "Beach Party",
                "price": "$$"
              }
            ]
          }
        }
      ]
    },
    {
      "day": 3,
      "title": "Adventure Activities and North Goa Exploration",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Dudhsagar Waterfalls Trek",
          "details": "Join a morning trek to one of India’s tallest waterfalls. Book this in advance.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": [
              {
                "name": "Waterfall Trek",
                "price": "$$$"
              }
            ]
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at Spice Plantation",
          "details": "Experience Goan cuisine amidst a serene plantation.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [
              {
                "name": "Sao Miguel Spice Plantation",
                "cuisine": "Indian",
                "price": "$$"
              }
            ],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Visit Fort Aguada",
          "details": "Explore the historic fort and enjoy views of the Arabian Sea at sunset.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        }
      ]
    },
    {
      "day": 4,
      "title": "Cultural Insights and Relaxation",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Visit Basilica of Bom Jesus and Se Cathedral",
          "details": "Explore these UNESCO World Heritage sites to appreciate Goan history.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at Vinayak Family Restaurant",
          "details": "A famous local eatery serving authentic Goan food.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Relax at Palolem Beach",
          "details": "Enjoy a quieter evening on this pristine beach.",
          "recommendations": {
            "accommodations": [
              {
                "name": "The LaLiT Golf & Resort",
                "type": "Luxury",
                "price": "$$$"
              }
            ],
            "restaurants": [
              {
                "name": "Art Resort Café",
                "cuisine": "International",
                "price": "$$"
              },
              {
                "name": "Dublin Soul",
                "cuisine": "Pub Fare",
                "price": "$$"
              }
            ],
            "activities": []
          }
        }
      ]
    },
    {
      "day": 5,
      "title": "Day Trip to South Goa",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Visit Cabo de Rama Fort",
          "details": "Explore the ancient fort with stunning views of the coastline.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at The Fish Thali",
          "details": "Try the local seafood thali for authenticity.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [
              {
                "name": "The Fish Thali",
                "cuisine": "Seafood",
                "price": "$"
              }
            ],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Relax by Agonda Beach",
          "details": "A tranquil beach experience for the evening.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        }
      ]
    },
    {
      "day": 6,
      "title": "Water Sports and Market Visits",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Water Sports at Colva Beach",
          "details": "Indulge in water sports like jet skiing and banana boat rides.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": [
              {
                "name": "Water Sports Package",
                "price": "$$$"
              }
            ]
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at Sandpat Beach Shack",
          "details": "Enjoy local dishes at this beach shack.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Visit the Margao Market for shopping",
          "details": "Experience the vibrant local market for souvenirs.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        }
      ]
    },
    {
      "day": 7,
      "title": "Departure Day",
      "activities": [
        {
          "time_of_day": "Morning",
          "activity": "Last-minute shopping and beach walking",
          "details": "Enjoy your last moments at the beach or shop for souvenirs.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Afternoon",
          "activity": "Lunch at Baby Shark’s",
          "details": "Cozy lunch spot by the beach.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        },
        {
          "time_of_day": "Evening",
          "activity": "Departure from Goa International Airport",
          "details": "Head to the airport for your flight home.",
          "recommendations": {
            "accommodations": [],
            "restaurants": [],
            "activities": []
          }
        }
      ]
    }
  ],
  "local_tips": {
    "customs": [
      "Dress modestly when visiting churches and temples.",
      "Respect local customs; ask before photographing people."
    ],
    "transportation": "Use local taxis or rent a bike for easy navigation.",
    "currency": "The currency is Indian Rupees (INR). ATMs are widely available.",
    "language": "The official language is Konkani; however, Hindi and English are widely understood."
  },
  "budget_breakdown": {
    "accommodation": "$600 (based on mid-range hotels)",
    "meals": "$200",
    "activities": "$300",
    "transportation": "$100",
    "total": "$1200"
  }
}

export default function Home() {

 const {destination, trip_duration, description, start_date, end_date} = plan.overview;
  const {itinerary} = plan;
  return (
   <div className="px-[24px] bg-[white] h-full">
      <div className="py-[16px]">
        <Hero description={description} destination={destination} trip_duration={trip_duration}/>
      </div>
      <Itinerary itinerary={itinerary} start_date={start_date}/>
   </div>
  );
}
