import * as React from 'react';
import { IFieldProps } from '../index';
import { FormikValues } from 'formik';
import { FormLabel, FormControlLabel, FormHelperText, FormHelperTextProps, FormControl, FormControlProps, RadioGroup, RadioGroupProps, Radio, RadioProps, FormControlLabelProps, FormLabelProps } from '@mui/material';
import { get, map } from 'lodash';
import { MenuOptionObject, getMenuOptions, getFieldError } from '../Utils';

export type MenuOptionObj = MenuOptionObject & { controlProps?: FormControlLabelProps };
export type MenuOptions = Array<string> | Array<MenuOptionObj>;
export interface IMUIRadioProps {
    options?: MenuOptions
    header?: string
    name?: string
    id?: string,
    headerProps?: FormLabelProps,
    helperText?: string,
    radioProps?: RadioProps,
    radioGroupProps?: RadioGroupProps
    formControlProps?: FormControlProps
    formHelperTextProps?: FormHelperTextProps
}

interface IProps extends IFieldProps {
    fieldProps?: IMUIRadioProps
}

export const MUIRadio: React.FC<IProps> = props => {
    const { fieldProps = {} as IMUIRadioProps, formikProps = {} as FormikValues } = props;
    const { header, options = [], headerProps, helperText, radioProps, radioGroupProps, formControlProps, formHelperTextProps } = fieldProps;
    const fieldValue = get(formikProps, `values.${fieldProps.name}`) || '';
    const menuOptions = getMenuOptions(options);
    const fieldError = getFieldError((fieldProps.name || ''), formikProps);

    return (
        <FormControl error={!!fieldError} {...formControlProps}>
            {
                (header) &&
                (<FormLabel {...headerProps}>{header}</FormLabel>)
            }
            <RadioGroup name={fieldProps.name} value={fieldValue} onChange={formikProps.handleChange} onBlur={formikProps.handleBlur} {...radioGroupProps}>
                {
                    map(menuOptions, (option: MenuOptionObj, index: number) => {
                        const { value, name, ...rest } = option;
                        return (
                            <FormControlLabel
                                key={`${fieldProps.id}_option_item_${index}`}
                                value={value + ''}
                                label={name}
                                control={<Radio {...radioProps} />}
                                {...rest}
                            />
                        )
                    })
                }
            </RadioGroup>
            {
                (fieldError || helperText) &&
                (
                    <FormHelperText {...formHelperTextProps}>{fieldError || helperText}</FormHelperText>
                )
            }

        </FormControl>
    )
}