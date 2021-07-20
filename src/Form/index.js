import React, { useState, useEffect, useMemo} from 'react';
import styled, { css } from 'styled-components';
import { actions, interpret, assign } from 'xstate';

import {ReactComponent as Tick} from '../assets/tick.svg';

import {ingotMachine} from '../IngotMachine';

const Form = () => {
    const [currentState, setCurrentState] = useState(ingotMachine.initialState);
    const [values, setValues] = useState(ingotMachine.context);
    const [errors, setErrors] = useState({isError: false});
    const [heavyUsage, setHeavyUsage] = useState(false);

    const service = useMemo(() =>
        interpret(ingotMachine)
            .onTransition(state => {
            // Update the current machine state when a transition occurs
            if (state.changed) {
                console.log('State: ', state)
                setCurrentState(state);
            }
            })
            .start(),
        []
    );

    useEffect(() => {
        return () => service.stop();
    }, []);

    const valid = (field) => {
        let isValid = true;

        if (!values[field]) {
            isValid = false;
            setErrors({
                isError: true,
                message: 'Value is missing. Please provide one.'
            })
        }
        return isValid;
    }

    const handleOnChange = (e) => {
        const {value, name} = e.currentTarget
        // console.log("Field:", name, value);
        setValues({
            ...values,
            [name]: value
        })

        setErrors({isError: false});
    }

    const handleNextPage = () => {
        const {value} = currentState;
        const state = Object.keys(value)[0] === 'account' ? value.account : value.customer;
        const stateValue = typeof value === 'object' ? state : value;

        // Patching
        if (!(stateValue === 'accidentHistory')) {
            if (!valid(stateValue)) return;

            setErrors({isError: false});

            if (stateValue === 'idType') {
                console.log('ID TYPE: ', values.idFile);
                service.send({type: 'NEXT', [stateValue]: values[stateValue], idFile: values.idFile});
            } else {
                service.send({type: 'NEXT', [stateValue]: values[stateValue]});
            }
        } else {
            service.send('NEXT');
        }
        

    };

    const handleOccupationChange = (e) => {
        const {value, name} = e.currentTarget
        setValues({
            ...values,
            [name]: {
                name: value,
                heavyUsage
            }
        })

        setErrors({isError: false});
    }
    
    const renderFormPage = () => {
        const {value} = currentState;
        const state = Object.keys(value)[0] === 'account' ? value.account : value.customer;
        const stateValue = typeof value === 'object' ? state : value;

        switch (stateValue) {
            case 'email':
                return (
                    <FormPage>
                        <div className="instructions">Enter email address:</div>
                        <Input
                            isError={errors.isError}
                            field="email"
                            onChange={(e) => handleOnChange(e)}
                            value={values.email}
                        />
                    </FormPage>
                )
            case 'password':
                return (
                    <FormPage>
                        <div className="instructions">Enter password:</div>
                        <Input
                            isError={errors.isError}
                            field="password"
                            onChange={(e) => handleOnChange(e)}
                            value={values.password}
                        />
                    </FormPage>
                )
            case 'firstName':
                return (
                    <FormPage>
                        <div className="instructions">Enter First Name:</div>
                        <Input
                            isError={errors.isError}
                            field="firstName"
                            onChange={(e) => handleOnChange(e)}
                            value={values.firstName}
                        />
                    </FormPage>
                )
            case 'lastName':
                return (
                    <FormPage>
                        <div className="instructions">Enter Last Name:</div>
                        <Input
                            isError={errors.isError}
                            field="lastName"
                            onChange={(e) => handleOnChange(e)}
                            value={values.lastName}
                        />
                    </FormPage>
                )
            case 'trn':
                return (
                    <FormPage>
                        <div className="instructions">Enter TRN:</div>
                        <Input
                            isError={errors.isError}
                            field="trn"
                            onChange={(e) => handleOnChange(e)}
                            value={values.trn}
                        />
                    </FormPage>
                )
            case 'gender':
                return (
                    <FormPage>
                        <div className="instructions">Enter Gender:</div>
                        <Select
                            isError={errors.isError}
                            field="gender"
                            onChange={(e) => handleOnChange(e)}
                            value={values.gender}
                            options={[
                                {
                                    value: 'M',
                                    name: 'Male'
                                },
                                {
                                    value: 'F',
                                    name: 'Female'
                                }
                            ]}
                        />
                        
                    </FormPage>
                )
            case 'dob':
                return (
                    <FormPage>
                        <div className="instructions">Enter Date of Birth:</div>
                        <Input
                            isError={errors.isError}
                            type="date"
                            field="dob"
                            onChange={(e) => handleOnChange(e)}
                            value={values.dob}
                        />
                    </FormPage>
                )
            case 'idType':
                return (
                    <FormPage>
                        <div className="instructions">Select Identification type:</div>
                        <Select
                            isError={errors.isError}
                            field="idType"
                            onChange={(e) => handleOnChange(e)}
                            value={values.idType}
                            options={[
                                {
                                    name: "Driver's Licence",
                                    value: "driversLicence"
                                },
                                {
                                    name: "Passport",
                                    value: "passport"
                                },
                                {
                                    name: "National ID",
                                    value: "nationalId"
                                }
                            ]}
                        />
                        <div className="space"/>

                        <div className="instructions">Enter Identification number:</div>
                        <Input
                            isError={errors.isError}
                            field="idFile"
                            onChange={(e) => handleOnChange(e)}
                            value={values?.idFile || ''}
                        />
                    </FormPage>
                )
            case 'occupation':
                return (
                    <FormPage>
                        <div className="instructions">Enter Occupation:</div>
                        <Select
                            isError={errors.isError}
                            field="occupation"
                            onChange={(e) => handleOccupationChange(e)}
                            value={values.occupation.name}
                            options={[
                                {
                                    name: "Tile Worker",
                                    value: "Tile Worker"
                                },
                                {
                                    name: "Construction Worker",
                                    value: "Construction Worker"
                                }
                            ]}
                        />
                        <div className="space"/>
                        <div className="checkbox-field">
                            <div className="instructions" style={{marginRight: 'var(--space-10)', marginBottom: 0}}>Heavy Usage?</div>
                            <Checkbox
                                onCheck={() => setHeavyUsage(!heavyUsage)}
                                checked={heavyUsage}
                            />
                        </div>
                        
                    </FormPage>
                )
            // VEHICLE USAGE
            case 'vehicleUsagePerDay':
                return (
                    <FormPage>
                        <div className="instructions">How often do you use the vehicle per day:</div>
                        <Input
                            isError={errors.isError}
                            type="number"
                            field="vehicleUsagePerDay"
                            onChange={(e) => handleOnChange(e)}
                            value={values.vehicleUsagePerDay}
                        />
                    </FormPage>
                )
            // ACCIDENT HISTORY
            case 'accidentHistory':
                return (
                    <FormPage>
                        <div className="instructions">Review the following report on accident history:</div>
                        <div className="report">
                            You have NO history of vehicular accidents.
                        </div>
                    </FormPage>
                )
            //RATECARD ENTRY
            case 'rateCardEntry':
                return (
                    <FormPage>
                        <div className="instructions">Please rate your experience:</div>
                        <Select
                            isError={errors.isError}
                            field="rateCardEntry"
                            onChange={(e) => handleOnChange(e)}
                            value={values?.rateCardEntry || 5}
                            options={[
                                {
                                    name: "Poor",
                                    value: 1
                                },
                                {
                                    name: "Average",
                                    value: 2
                                },
                                {
                                    name: "Good",
                                    value: 3
                                },
                                {
                                    name: "Very Good",
                                    value: 4
                                },
                                {
                                    name: "Excellent",
                                    value: 5
                                },
                            ]}
                        />
                    </FormPage>
                )
  
            default:
                return(
                    <div>Form</div>
                );
        }
    }

    return (
        <FormContainer>
            <div className="title">Form using X-STATE</div>
            {currentState.done && <div className="finish-alert">You are at the last page of the form!</div>}
            {renderFormPage()}
            {errors.message &&
                <div className="error">{errors.message}</div>
            }
            <button
                className="form-button"
                onClick={handleNextPage}
                disabled={errors.isError || currentState.done}
            >
                NEXT
            </button>
        </FormContainer>
    )
}

export default Form;

const Input = ({isError = false, type = "text", field = "", onChange, value}) => {
    return (
        <input
            className={`form-input ${isError && 'error'}`}
            type={type}
            name={field}
            onChange={(e) => onChange(e)}
            value={value}
        />
    )
};

const Select = ({isError = false, field = "", onChange, value, options}) => {
    return (
        <select
            className={`form-input ${isError && 'error'}`}
            name={field}
            id={field}
            onChange={(e) => onChange(e)}
            value={value}
        >
            {options.map((option, index) => (
                <option key={`${Math.random() + index}`} value={option.value}>{option.name}</option>
            ))}
        </select>
    )
};

const Checkbox = ({onCheck, checked = false}) => {
    return (

        <CheckboxContainer onClick={() => onCheck()} checked={checked}>
            {checked && <Tick stroke="var(--color-white)" style={{marginBottom: '1px'}}/>}
        </CheckboxContainer>
    )
}

const FormContainer = styled.div`
    padding: 2rem;
    min-height: 10.25rem;
    width: 32.125rem;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    background: var(--color-white);
    /* shadow-xl */

    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
    border-radius: 1rem;

    .title {
        font-family: 'DM Sans';
        font-style: normal;
        font-weight: 500;
        font-size: var(--font-24);
        line-height: 1.5rem;

        color: var(--color-black);

        margin-bottom: 2rem;

    }

    .form-button {
        width: 7.5rem;
        height: 2.5rem;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--easy-red);
        border-radius: 0.25rem;
        
        border: 0;
        outline: none;

        align-self: flex-end;
        margin-top: 2rem;

        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: var(--font-16);
        line-height: 1rem;

        color: var(--color-white);

        cursor: pointer;

        :disabled{
            /* default/gray/200 */

            background: var(--color-gray-200);
            color: var(--color-gray-600);
            cursor: not-allowed;
        }
    }

    .error {
        font-family: Inter;
        font-style: normal;
        font-weight: normal;
        font-size: var(--font-14);
        line-height: 0.875rem;

        color: var(--color-orange-900);
        margin-top: var(--space-12);
    }

    .finish-alert{
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
        
        background: linear-gradient(96.56deg, rgba(241, 242, 243, 0.8) -1.2%, rgba(255, 255, 255, 0.576) 52.65%, rgba(253, 253, 253, 0.8) 97.44%), #F6F8F9;
        border: 2px solid var(--color-purple-700);
        box-sizing: border-box;
        border-radius: 0.5rem;

        padding: 0.5rem;
        margin-bottom: 1rem;

        color: var(--color-purple-700);

        font-family: DM Sans;
        font-style: normal;
        font-weight: normal;
        font-size: var(--font-14);
        line-height: 0.875rem;

    }
`;

const FormPage = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: var(--font-14);
    line-height: 0.875rem;

    .instructions {
        color: var(--color-black);
        margin-bottom: 0.75rem;

    }
    .form-input{
        width: 100%;
        height: 2.5rem;

        padding: 0.75rem 1rem;
        background: var(--color-white);

        border: 1px solid var(--color-gray-400);
        box-sizing: border-box;
        border-radius: 0.25rem;

        ${props => props.error && css`
            background: var(--color-orange-100);
            border: 1px solid var(--color-orange-900);
        `}

    }
    .error{
        background: var(--color-orange-100);
        border: 1px solid var(--color-orange-900);
        
    }
    .space {
        height: 1.25rem;
    }
    .checkbox-field{
        display: flex;
        align-items: center;
    }
    .report{
        color: var(--color-black);
    }

`;

const CheckboxContainer = styled.div`
    height: 1rem;
    width: 1rem;

    display: flex;
    align-items: center;
    justify-content: center;

    /* default/gray/300 */
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;

    ${props => props.checked && css`
        background: var(--easy-red);
        border: 0;
    `}
`;