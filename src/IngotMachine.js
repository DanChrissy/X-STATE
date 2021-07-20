import { createMachine, actions, assign } from 'xstate';

const markdownPrice = assign({
    result: (context, event) => context.result - (context.result * 0.05)
});
const markdownPrice20k = actions.assign({
    result: (context) => context.result - 20000
});
const add10ToPremium = actions.assign({
    premium: (context) => context.premium + 10000
});
const registerCustomer = actions.assign({
    customer: (context) => `${context.firstName} ${context.lastName}`
});

const loadOccupations = (context) => {
    return true;
};

const values = {
    result: 50000,
    premium: 40000
}
export const ingotMachine = createMachine(
    {
        id: 'ingotTest',
        initial: 'account',
        context: {
            email: 'howard.edwards@smsja.net',
            password: 'password1',
            firstName: 'Howard',
            lastName: 'Edwards',
            trn: '123456789',
            gender: 'M',
            dob: '1994-08-08',
            age: '25',
            idType: 'driversLicence',
            idFile: null,
            occupation: {
                name: 'Tile Worker',
                heavyUsage: false
            },
            vehicleUsagePerDay: 6,
            premium: 1000,
            result: 1900000
        },
        states: {
            account: {
                initial: 'email',
                states: {
                    email : {
                        entry: [
                            'markdownPrice',
                            'markdownPrice20k'
                            // assign({
                            //     result: (context, event) => context.result - (context.result * 0.05)
                            // }),
                            // assign({
                            //     result: (context) => context.result - 20000
                            // })
                        ],
                        on: {
                            NEXT: {
                                target: 'password',
                                cond: 'validateEmail',
                            }
                        },
                        exit: [
                            assign({
                                email: (_, event) => event.email
                            })
                        ]
                        
                    },
                    password: {
                        entry: [
                            'markdownPrice'
                        ],
                        on: {
                            NEXT: {
                                target: '#ingotTest.customer',
                                cond: 'validatePassword'
                            }
                        },
                        exit: [
                            assign({
                                password: (_, event) => event.password
                            })
                        ]
                    }
                },
            },
            customer: {
                initial: 'firstName',
                states: {
                    firstName: {
                        on: {
                            NEXT: {
                                target: 'lastName',
                                cond: 'validateFirstName'
                            }
                        },
                        exit: [
                            assign({
                                firstName: (_, event) => event.firstName
                            })
                        ]
                    },
                    lastName: {
                        on: {
                            NEXT: {
                                target: 'trn',
                                cond: 'validateLastName'
                            }
                        },
                        exit: [
                            assign({
                                lastName: (_, event) => event.lastName
                            })
                        ]
                    },
                    trn: {
                        on: {
                            NEXT: {
                                target: 'gender',
                                cond: 'validateTrn'
                            }
                        },
                        exit: [
                            assign({
                                trn: (_, event) => event.trn
                            })
                        ]
                    },
                    gender: {
                        on: {
                            NEXT: {
                                target: 'dob',
                                cond: 'validateGender'
                            }
                        },
                        exit: [
                            assign({
                                gender: (_, event) => event.gender
                            })
                        ]
                    },
                    dob: {
                        on: {
                            NEXT: {
                                target: '#ingotTest.idType',
                                cond: 'validateDOB'
                            }
                        },
                        exit: [
                            assign({
                                dob: (_, event) => event.dob,
                                customer: (context) => `${context.firstName} ${context.lastName}`
                            })
                        ]
                        
                    },
                }
            },
            idType: {
                // Can be self-transition since it's select OR
                // DIfferent states for all the possible select items
                on: {
                    NEXT: {
                        target: 'occupation',
                        // cond: 'validateFile'
                    }
                },
                exit: [
                    assign({
                        idType: (_, event) => event.idType,
                        idFile: (_, event) => event.idFile
                    })
                ]
            },
            occupation: {
                on: {
                    NEXT: {
                        target: 'vehicleUsage',
                        cond: 'vehicleUsageValid'
                    },
                    NEXT: {
                        target: 'accidentHistory',
                        cond: 'accidentHistoryValid'
                    }
                },
                exit: [
                    assign({
                        occupation: (_, event) => event.occupation
                    })
                ]
            },
            vehicleUsagePerDay: {
                on: {
                    NEXT: 'rateCardEntry'
                },
                exit: [
                    assign({
                        vehicleUsagePerDay: (_, event) => event.vehicleUsagePerDay
                    })
                ]
            },
            accidentHistory: {
                on: {
                    NEXT: 'rateCardEntry'
                },
            },
            rateCardEntry: {
                type: 'final',
                exit: [
                    assign({
                        rateCardEntry: (_, event) => event.rateCardEntry
                    })
                ]
            }
        }
    },
    {
        guards: {
            vehicleUsageValid: (context) => {
                return context.occupation.heavyUsage && context.occupation.name === 'Construction Worker'
            },
            accidentHistoryValid: (context) => !context.occupation.heavyUsage,
            premiumValid: (context) => context.gender === 'M' && context.age <= 27,
            mardownValid: (context) => context.result >= 850000 && context.result <= 2500000,
            validateEmail: (context) => context.email,
            validatePassword: (context) => context.password,
            validateFirstName: (context) => context.firstName,
            validateLastName: (context) => context.lastName,
            validateTrn: (context) => context.trn,
            validateGender: (context) => context.gender,
            validateDOB: (context) => context.dob,
            validateFile: (context) => context.idFile,
        },
        actions: {
            markdownPrice,
            markdownPrice20k,
            add10ToPremium,
            registerCustomer,
        }
    }
);
