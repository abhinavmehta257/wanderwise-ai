export const TRAVEL_SCHEMA = {
  type: "object",
  properties: {
    step: {
      type: "string",
      description: "Indicates the step in the travel planning process.",
    },
    prompt: {
      type: "string",
      description: "Question asking where the user would like to travel.",
    },
    suggestions: {
      type: "array",
      description: "List of suggested destinations.",
      items: {
        type: "string",
        description: "A suggested city to travel to.",
      },
    },
    trip_details: {
      type: "object",
      description: "Contains details regarding the trip.",
      properties: {
        destination: {
          type: "string",
          description: "The selected travel destination.",
        },
        from_date: {
          type: "string",
          description: "Start date of the trip.",
        },
        to_date: {
          type: "string",
          description: "End date of the trip.",
        },
        is_finalized: {
          type: "boolean",
          description: "true if the user confirmed all the trip details",
        },
        number_of_days: {
          type: "number",
          description: "number of days of trip",
        },
      },
      required: [
        "destination",
        "from_date",
        "to_date",
        "is_finalized",
        "number_of_days",
      ],
      additionalProperties: false,
    },
  },
  required: ["step", "prompt", "suggestions", "trip_details"],
  additionalProperties: false,
};
