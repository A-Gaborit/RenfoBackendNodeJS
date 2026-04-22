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
    EXPERTISE_DONE: {
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
  },

  EXPERTISE_DONE: {
    // Transition to Scenario 1 (REPAIRABLE)
    INTERVENTION_WAITING_PICKUP_SCHEDULE: {
      next: 'INTERVENTION_WAITING_PICKUP_SCHEDULE',
      condition: (request) => request.diagnostic === 'REPAIRABLE',
      requiredFields: ['case1_date_of_service_plan'],
      apply: (request, payload) => {
        request.case1_date_of_service_plan = payload.case1_date_of_service_plan;
      }
    },
    // Transition to Scenario 2 (UNREPAIRABLE)
    START_VALUATION: {
      next: 'VALUATION_SENT',
      condition: (request) => request.diagnostic === 'UNREPAIRABLE',
      requiredFields: ['case2_estimated_compensation'],
      apply: (request, payload) => {
        request.case2_estimated_compensation = payload.case2_estimated_compensation;
      }
    }
  },

  // Scenario 1 - Véhicule réparable
  INTERVENTION_WAITING_PICKUP_SCHEDULE: {
    WAITING_PICKUP_SCHEDULE: {
      next: 'WAITING_PICKUP_SCHEDULE',
      requiredFields: ['case1_pickup_plan_date'],
      apply: (request, payload) => {
        request.case1_pickup_plan_date = payload.case1_pickup_plan_date;
      }
    }
  },

  WAITING_PICKUP_SCHEDULE: {
    PICKUP_PLANNED: {
      next: 'PICKUP_PLANNED',
      requiredFields: ['case1_pickup_effective_date'],
      apply: (request, payload) => {
        request.case1_pickup_effective_date = payload.case1_pickup_effective_date;
      }
    }
  },

  PICKUP_PLANNED: {
    INTERVENTION_IN_PROGRESS: {
      next: 'INTERVENTION_IN_PROGRESS',
      requiredFields: ['case1_date_of_service_effective'],
      apply: (request, payload) => {
        request.case1_date_of_service_effective = payload.case1_date_of_service_effective;
      }
    }
  },

  INTERVENTION_IN_PROGRESS: {
    RESTITUTION_WAITING_SCHEDULE: {
      next: 'RESTITUTION_WAITING_SCHEDULE',
      requiredFields: ['case1_end_date_of_service'],
      apply: (request, payload) => {
        request.case1_end_date_of_service = payload.case1_end_date_of_service;
      }
    }
  },

  RESTITUTION_WAITING_SCHEDULE: {
    RESTITUTION_IN_PROGRESS: {
      next: 'RESTITUTION_IN_PROGRESS',
      requiredFields: ['case1_return_date_plan'],
      apply: (request, payload) => {
        request.case1_return_date_plan = payload.case1_return_date_plan;
      }
    }
  },

  RESTITUTION_IN_PROGRESS: {
    INVOICE_WAITING: {
      next: 'INVOICE_WAITING',
      requiredFields: ['case1_return_date_effective'],
      apply: (request, payload) => {
        request.case1_return_date_effective = payload.case1_return_date_effective;
      }
    }
  },

  INVOICE_WAITING: {
    INVOICE_PAID_WAITING_WARRANTY: {
      next: 'INVOICE_PAID_WAITING_WARRANTY',
      requiredFields: ['case1_contractor_invoice_date', 'case1_contractor_invoice'],
      apply: (request, payload) => {
        request.case1_contractor_invoice_date = payload.case1_contractor_invoice_date;
        request.case1_contractor_invoice = payload.case1_contractor_invoice;
      }
    }
  },

  INVOICE_PAID_WAITING_WARRANTY: {
    CLOSURE_DECISION: {
      next: 'CLOSURE_DECISION',
      requiredFields: ['case1_date_contractor_invoice_paid'],
      apply: (request, payload) => {
        request.case1_date_contractor_invoice_paid = payload.case1_date_contractor_invoice_paid;
        request.warranty_period_end = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h from now
      }
    }
  },

  CLOSURE_DECISION: {
    CLOSED: {
      next: 'CLOSED',
      requiredFields: ['responsibility'],
      condition: (request, payload) => !payload || payload.responsibility === 100,
      apply: (request, payload) => {
        request.responsibility = payload.responsibility;
      },
      close: true
    },
    INVOICE_THIRD_PARTY_PENDING_CASE1: {
      next: 'INVOICE_THIRD_PARTY_PENDING_CASE1',
      requiredFields: ['responsibility'],
      condition: (request, payload) => !payload || payload.responsibility === 50 || payload.responsibility === 0,
      apply: (request, payload) => {
        request.responsibility = payload.responsibility;
      }
    }
  },

  INVOICE_THIRD_PARTY_PENDING_CASE1: {
    CLOSED: {
      next: 'CLOSED',
      requiredFields: ['case1_third_party_invoice_paid'],
      apply: (request, payload) => {
        request.case1_third_party_invoice_paid = payload.case1_third_party_invoice_paid;
      },
      close: true
    }
  },
  

  // Scénario 2 - Véhicule non réparable
  VALUATION_SENT: {
    CLIENT_APPROVES: {
      next: 'PICKUP_SCHEDULE_WAITING_RIB',
      requiredFields: ['case2_approved_compensation'],
      condition: (request, payload) => payload.case2_approved_compensation === true,
      apply: (request, payload) => {
        request.case2_approved_compensation = payload.case2_approved_compensation;
      }
    }
  },

  PICKUP_SCHEDULE_WAITING_RIB: {
    SCHEDULE_WITH_RIB: {
      next: 'PICKUP_PLANNED_CASE2',
      requiredFields: ['case2_pickup_plan_date', 'case2_insured_rib'],
      apply: (request, payload) => {
        request.case2_pickup_plan_date = payload.case2_pickup_plan_date;
        request.case2_insured_rib = payload.case2_insured_rib;
      }
    }
  },

  PICKUP_PLANNED_CASE2: {
    CONFIRM_PICKUP_CASE2: {
      next: 'COMPENSATION_WAITING_PAYMENT',
      requiredFields: ['case2_pickup_effective_date'],
      apply: (request, payload) => {
        request.case2_pickup_effective_date = payload.case2_pickup_effective_date;
      }
    }
  },

  COMPENSATION_WAITING_PAYMENT: {
    PAY_COMPENSATION: {
      next: 'CLOSURE_DECISION_CASE2',
      requiredFields: ['case2_compensation_payment_date'],
      apply: (request, payload) => {
        request.case2_compensation_payment_date = payload.case2_compensation_payment_date;
      }
    }
  },

  CLOSURE_DECISION_CASE2: {
    CLOSE_100_PERCENT_CASE2: {
      next: 'CLOSED',
      requiredFields: ['responsibility'],
      condition: (request, payload) => !payload || payload.responsibility === 100,
      apply: (request, payload) => {
        request.responsibility = payload.responsibility;
      },
      close: true
    },
    INVOICE_THIRD_PARTY_CASE2: {
      next: 'INVOICE_THIRD_PARTY_PENDING_CASE2',
      requiredFields: ['responsibility'],
      condition: (request, payload) => !payload || payload.responsibility === 50 || payload.responsibility === 0,
      apply: (request, payload) => {
        request.responsibility = payload.responsibility;
      }
    }
  },

  INVOICE_THIRD_PARTY_PENDING_CASE2: {
    CONFIRM_THIRD_PARTY_PAID_CASE2: {
      next: 'CLOSED',
      requiredFields: ['case2_third_party_invoice_paid'],
      apply: (request, payload) => {
        request.case2_third_party_invoice_paid = payload.case2_third_party_invoice_paid;
      },
      close: true
    }
  }
};

function getAvailableTransitions(currentState, request) {
  const stateTransitions = transitions[currentState];
  if (!stateTransitions) return [];

  return Object.entries(stateTransitions).map(([action, config]) => ({
    action,
    ...config,
    available: !config.condition || config.condition(request)
  }));
}

function isValidTransition(currentState, action, request, payload = {}) {
  const stateTransitions = transitions[currentState];
  if (!stateTransitions || !stateTransitions[action]) {
    return false;
  }

  const transition = stateTransitions[action];
  if (transition.condition && !transition.condition(request, payload)) {
    return false;
  }

  return true;
}

function getNextState(currentState, action) {
  const stateTransitions = transitions[currentState];
  if (!stateTransitions || !stateTransitions[action]) {
    return null;
  }
  return stateTransitions[action].next;
}

module.exports = {
  transitions,
  getAvailableTransitions,
  isValidTransition,
  getNextState
};
