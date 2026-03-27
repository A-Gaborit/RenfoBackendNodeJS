const transitions = {
  INITIATE: {
    REQUEST_EXPERTISE: {
      next: 'REQUEST_EXPERTISE',

      requiredFields: ['expertise_plan_date'],

      apply: (request, payload) => {
        request.expertise_plan_date = payload.expertise_plan_date;
      }
    }
  },

  REQUEST_EXPERTISE: {
    EXPERTISE_PLANNED: {
      next: 'EXPERTISE_PLANNED',

      requiredFields: ['expertise_effective_date'],

      apply: (request, payload) => {
        request.expertise_effective_date = payload.expertise_effective_date;
      }
    }
  },

  EXPERTISE_PLANNED: {
    COMPLETE_EXPERTISE: {
      next: 'EXPERTISE_DONE',

      requiredFields: [
        'expertise_report_recieved',
        'diagnostic',
        'diagnostic_report_file'
      ],

      apply: (request, payload) => {
        request.expertise_report_recieved = payload.expertise_report_recieved;
        request.diagnostic = payload.diagnostic;
        request.diagnostic_report_file = payload.diagnostic_report_file;
      }
    }
  }
};

module.exports = {
  transitions
};
