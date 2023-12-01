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
}, (prev, next) => {
    let shouldUpdate = false
    prev.fieldProps!.id = '1'
    next.fieldProps!.id = '1'
    if (!isEqual(prev.fieldProps, next.fieldProps))
        shouldUpdate = true
    const fieldProps = prev.fieldProps

    const pValue = get(prev.formikProps, `values.${fieldProps?.name}`) || ((fieldProps?.multiple) ? [] : '');
    const nValue = get(next.formikProps, `values.${fieldProps?.name}`) || ((fieldProps?.multiple) ? [] : '');

    const pError = get(prev.formikProps, `errors.${fieldProps?.name}`) || ((fieldProps?.multiple) ? [] : '');
    const nError = get(prev.formikProps, `errors.${fieldProps?.name}`) || ((fieldProps?.multiple) ? [] : '');

    if (!isEqual(pError, nError)) {
        shouldUpdate = true
    }

    if (!isEqual(pValue, nValue)) {
        shouldUpdate = true
    }

    return !shouldUpdate
})