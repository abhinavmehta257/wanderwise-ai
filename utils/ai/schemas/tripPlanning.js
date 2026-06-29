export const TRIP_PLANNING_SCHEMA = {
  type: "object",
  properties: {
    number_of_days: {
      type: "integer",
      description: "number of days of trip",
    },
    meta_data: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the document or entry.",
        },
        author: {
          type: "string",
          description: "The name of the author or creator.",
        },
        tags: {
          type: "array",
          description: "A list of tags associated with the document.",
          items: {
            type: "string",
            description: "A single tag.",
          },
        },
      },
      required: ["title", "author", "tags"],
      additionalProperties: false,
    },
    overview: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          description: "The destination of the trip.",
        },
        description: {
          type: "string",
          maxLength: 229,
          description:
            "A short teaser for the trip (under 230 characters). One or two punchy sentences about the destination and vibe.",
        },
      },
      required: ["destination", "description"],
      additionalProperties: false,
    },
    itinerary: {
      type: "array",
      description:
        "List of planned activities for each day. length cannot be less than the number of days provided.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description: "The day number of the trip.",
          },
          title: {
            type: "string",
            description: "The title of the day's itinerary.",
          },
          activities: {
            type: "array",
            description: "Activities planned for the day.",
            items: {
              type: "object",
              properties: {
                time_of_day: {
                  type: "string",
                  description: "The time of day for the activity.",
                },
                activity: {
                  type: "string",
                  description: "The activity being done.",
                },
                details: {
                  type: "string",
                  description:
                    "sort detail about the activity, what to do and whats interesting.",
                },
              },
              required: ["time_of_day", "activity", "details"],
              additionalProperties: false,
            },
          },
        },
        required: ["day", "title", "activities"],
        additionalProperties: false,
      },
    },
    local_tips: {
      type: "object",
      properties: {
        customs: {
          type: "array",
          description: "Customs to be aware of while visiting.",
          items: {
            type: "string",
          },
        },
        transportation: {
          type: "string",
          description: "Transportation tips.",
        },
        currency: {
          type: "string",
          description: "Currency tips.",
        },
        language: {
          type: "string",
          description: "Language tips.",
        },
      },
      required: ["customs", "transportation", "currency", "language"],
      additionalProperties: false,
    },
    budget_breakdown: {
      type: "object",
      properties: {
        accommodation: {
          type: "number",
          description: "Estimated cost amount for accommodation.",
        },
        meals: {
          type: "number",
          description: "Estimated cost amount for meals in local currency.",
        },
        activities: {
          type: "number",
          description: "Estimated cost amount for activities in local currency.",
        },
        transportation: {
          type: "number",
          description:
            "Estimated cost amount for transportation in local currency.",
        },
        total: {
          type: "number",
          description: "Total estimated budget amount in local currency.",
        },
        currency: {
          type: "string",
          description: "Local currency symbol.",
        },
      },
      required: [
        "accommodation",
        "meals",
        "activities",
        "transportation",
        "total",
        "currency",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "number_of_days",
    "meta_data",
    "overview",
    "itinerary",
    "local_tips",
    "budget_breakdown",
  ],
  additionalProperties: false,
};
