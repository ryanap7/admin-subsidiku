/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Control, RegisterOptions, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Recipient } from '.';
import { LucideIcon } from 'lucide-react';

export interface Pagination {
    search?: string;
    page?: number;
    limit?: number;
}

export interface RecipientParams extends Pagination {
    status?: string;
    classification?: string;
    productId?: number;
}

export interface SummaryCardProps {
    title: string;
    value: number | string;
    valueClassName?: string;
    icon: React.ElementType;
    iconBgClassName?: string;
    iconClassName?: string;
    subText?: string | React.ReactNode;
    subTextClassName?: string;
    delay?: number;
}

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    register?: UseFormRegister<any>;
    description?: string;
    rules?: RegisterOptions;
    error?: string;
}

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    name: string;
    register?: UseFormRegister<any>;
    description?: string;
    rules?: RegisterOptions;
    error?: string;
}

export interface Option {
    label: string;
    value: string;
}

export interface MultiSelectBoxCheckboxProps {
    name: string;
    label: string;
    control: Control<any>;
    options: Option[];
}

export interface SelectBoxProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: string;
    options: Option[];
    register?: UseFormRegister<any>;
    description?: string;
    rules?: RegisterOptions;
    error?: string;
}

export interface ToggleButtonProps {
    label: string;
    name: string;
    register?: UseFormRegister<any>;
}

export interface SwitchToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
    label?: string;
    description?: string;
    register?: UseFormRegister<any>;
    setValue?: UseFormSetValue<any>;
    watch?: UseFormWatch<any>;
    name: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
    labelPosition?: 'left' | 'right';
    showLabels?: boolean;
    onLabel?: string;
    offLabel?: string;
    disabled?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
}

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    label: string;
    name: string;
    register?: UseFormRegister<any>;
    step?: number;
    min?: number;
    max?: number;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    rules?: RegisterOptions;
    helperText?: string;
    onChange?: (value: number | null) => void;
}

export interface DropdownMultipleSelectProps {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    register?: any;
    setValue?: (name: string, value: any) => void;
    watch?: any;
    placeholder?: string;
    searchable?: boolean;
    maxHeight?: string;
    error?: string;
}

export interface FormButtonsProps {
    okText: string;
    onCancel: () => void;
}

export interface SuspendModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuspend: (notes: string) => void;
    selectedRecipient?: Recipient;
}

export interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string; 
    Icon?: LucideIcon;
}
