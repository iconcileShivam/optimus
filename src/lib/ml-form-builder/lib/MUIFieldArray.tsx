import React from 'react';
import { IFieldProps } from '../index';
import { FieldArray, FormikValues } from 'formik';
import { get } from 'lodash';
import { IconButton, Button, ButtonProps, IconButtonProps, TextFieldProps, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getComponentConfig } from '../index';

interface IFieldArrayProps {
    name: string
    id: string
    itemType: string
    addButtonProps?: ButtonProps
    addButtonText?: string
    addButton?: JSX.Element
    removeButton?: JSX.Element
    removeButtonProps?: IconButtonProps
    textFieldProps?: TextFieldProps
    defaultData?: any
}
export interface IProps extends IFieldProps {
    fieldProps?: IFieldArrayProps
}

/* interface IArrayItemProps extends TextFieldProps {
    fieldValue?: string
    formikProps?: FormikValues
    name?: string
    itemIndex?: number

} */

/* export const ArrayItem:React.FC<IArrayItemProps> = (props) => {
    const {fieldValue='',} = props;
    return (
        <div>
            <TextField/>
        </div>
    )
} */

export const MUIFieldArray: React.FC<IProps> = (props) => {
    const { formikProps = {} as FormikValues, fieldProps = {} as IFieldArrayProps } = props;
    const { itemType, addButtonText = 'Add', addButtonProps, addButton, removeButton, removeButtonProps, textFieldProps = {}, defaultData = {} } = fieldProps;
    const values = get(formikProps, `values.${fieldProps.name}`);
    const itemComponentConfig = getComponentConfig(itemType);



    return (
        <FieldArray name={fieldProps.name}
            render={arrayHelpers => (
                <div>
                    {
                        (values || []).map((value: any, index: number) => (
                            <Box key={`${fieldProps.name}-${index}`} position={'relative'}>
                                {React.cloneElement(itemComponentConfig.component, { name: fieldProps.name, itemIndex: index, arrayHelpers, fieldValue: value, formikProps, ...itemComponentConfig.props, ...textFieldProps })}
                                {
                                    (removeButton) ? removeButton : (
                                        <IconButton sx={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '50%',
                                            transform: 'translate(0,-50%)'
                                        }} size="small" onClick={() => arrayHelpers.remove(index)} {...removeButtonProps}><CloseIcon /></IconButton>
                                    )
                                }

                            </Box>
                        ))
                    }
                    <div>
                        {(addButton) ? addButton : (<Button type="button" onClick={() => arrayHelpers.push(defaultData)} {...addButtonProps}>{addButtonText}</Button>)}
                    </div>

                </div>

            )}
        />
    )
}
