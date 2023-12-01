import { Box } from '@mui/material'
import { Formik } from 'formik'
import { FC } from 'react'
import { MLFormContent } from 'react-forms'

export interface FormContainerProps { }

const FormContainer: FC<FormContainerProps> = (props) => {

    return (
        <Box width="500px" margin="90px auto" >
            <Formik
                initialValues={{}}
                onSubmit={() => { }}
            >
                {
                    formikProps => {
                        return (
                            <MLFormContent
                                formId={'form'}
                                formikProps={formikProps}
                                schema={[
                                    [{
                                        type: 'text',
                                        valueKey: `Hello`,
                                        fieldProps: {
                                            label: 'Names',
                                            fullWidth: true,
                                        }
                                    }],
                                    [{
                                        type: 'select',
                                        valueKey: `Name`,
                                        fieldProps: {
                                            label: 'Service ID',
                                            formControlProps: {
                                                fullWidth: true,
                                            },
                                            options: [{ name: "Lion Sin", value: "Escanor" }, { name: "Dragon Sin", value: "meleodas" }]
                                        }
                                    }],
                                    [{
                                        type: 'select',
                                        valueKey: `naruto`,
                                        fieldProps: {
                                            label: 'Ninja',
                                            formControlProps: {
                                                fullWidth: true,
                                            },
                                            options: [{ name: "Kakashi", value: "copy" }, { name: "Naruto", value: "hello" }]
                                        }
                                    }]
                                ]}
                            />
                        )
                    }
                }
            </Formik>
        </Box>
    )
}

export default FormContainer