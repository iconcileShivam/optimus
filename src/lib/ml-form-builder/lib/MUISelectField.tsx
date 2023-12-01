import * as React from 'react';
import { Select, FormControl, FormControlProps, FormHelperText, FormHelperTextProps, MenuItem, InputLabel, SelectProps, MenuItemProps, InputLabelProps, SelectChangeEvent } from '@mui/material';
import { IFieldProps, FormConfig } from '../index';
import { FormikValues } from 'formik';
import _, { get, map, isString, isEqual } from 'lodash';
import { MenuOptions, MenuOptionObject, getMenuOptions, getFieldError } from '../Utils';

export interface IMUISelectProps extends SelectProps {
    label?: string
    options?: MenuOptions
    emptyItem?: string | boolean
    helperText?: string
    formControlProps?: FormControlProps
    formHelperTextProps?: FormHelperTextProps
    emptyMenuItemProps?: object
    menuItemProps?: object
    inputLabelProps?: object
    hasObjectValue?: boolean
}

export interface IProps extends IFieldProps {
    fieldProps?: IMUISelectProps
}

export const MUISelectField: React.FC<IProps> = React.memo((props) => {
    const { fieldConfig = {} as FormConfig, formikProps = {} as FormikValues, fieldProps = {} as IMUISelectProps } = props;
    const { label,
        options = [],
        emptyItem,
        helperText,
        formControlProps,
        formHelperTextProps,
        emptyMenuItemProps = {} as MenuItemProps,
        menuItemProps = {} as MenuItemProps,
        inputLabelProps = {} as InputLabelProps,
        hasObjectValue = false,
        ...selectProps } = fieldProps;
    const labelId = `${fieldConfig.id}_label`;
    const fieldError = getFieldError((fieldProps.name || ''), formikProps);
    const emptyItemText = (isString(emptyItem) ? emptyItem : 'None');
    const menuOptions = getMenuOptions(options);
    let value = get(formikProps, `values.${fieldProps.name}`) || ((selectProps.multiple) ? [] : '');

    if (hasObjectValue) {
        value = JSON.stringify(value)
    }

    const handleChange = (e: SelectChangeEvent) => {
        let data = e.target.value;
        if (hasObjectValue) {
            data = JSON.parse(data)
        }
        formikProps.setFieldValue(fieldProps.name, data)
    }

    return (
        <FormControl error={!!fieldError} {...formControlProps}
        >
            {
                label &&
                (<InputLabel id={labelId} {...inputLabelProps}>{label}</InputLabel>)
            }
            <Select
                labelId={labelId}
                id={fieldConfig.id}
                value={value}
                onChange={handleChange}
                onBlur={formikProps.handleBlur}
                label={label}
                {...selectProps}
            >
                {
                    (emptyItem) &&
                    (<MenuItem value='' {...emptyMenuItemProps}>
                        {emptyItemText}
                    </MenuItem>)
                }
                {
                    // @ts-ignore MenuItem props types have some ambiguity in Mui type Definition
                    map(menuOptions, (item: MenuOptionObject, index: number) => {
                        const value = hasObjectValue ? JSON.stringify(item.value) : item.value
                        return (
                            <MenuItem
                                key={`${fieldConfig.id}_menu_item_${index}`}
                                value={value}
                                {...menuItemProps}
                                {...(item.menuItemProps || {})}
                            >
                                {item.name}
                            </MenuItem>
                        )
                    })
                }
            </Select>
            {
                (fieldError || fieldProps.helperText) &&
                (
                    <FormHelperText {...formHelperTextProps}>{fieldError || fieldProps.helperText}</FormHelperText>
                )
            }

        </FormControl>
    )
}, (p, n) => {


    p.fieldProps!.id = '1'
    n.fieldProps!.id = '1'

    const pFieldName = p.fieldProps?.name || ''
    const nFieldName = n.fieldProps?.name || ''

    // ========== Checking for getFieldError

    // Field Value
    if (!isEqual(get(p.formikProps, `values.${pFieldName}`), get(n.formikProps, `values.${nFieldName}`))) {
        return false
    }

    // Field Error
    if (!isEqual(get(p.formikProps, `errors.${pFieldName}`), get(n.formikProps, `errors.${nFieldName}`))) {
        return false
    }

    // get(formikProps, `touched.${fieldName}`)
    if (!isEqual(get(p.formikProps, `touched.${pFieldName}`), get(n.formikProps, `touched.${nFieldName}`))) {
        return false
    }

    // formikProps.submitCount
    if (!isEqual(p.formikProps?.submitCount, n.formikProps?.submitCount)) {
        return false
    }

    // Readonly Prop
    if (!isEqual(p.isReadOnly, n.isReadOnly)) {
        return false
    }

    // Field Props
    if (!isEqual(p.fieldProps, n.fieldProps)) {
        return false
    }

    return true

})