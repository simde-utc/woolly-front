import React from 'react';
import {
	TextField, Checkbox, FormControlLabel,
	FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';


class FieldGenerator {

	// TODO Finish error texts

	constructor(store, errors, handleChange, keyPrefix = null, defaultProps = null) {
		this.store = store;
		this.errors = errors;
		this.handleChange = handleChange;
		this.keyPrefix = keyPrefix;
		this.defaultProps = defaultProps;
	}

	handleChangeDatetime = name => value => {
		const fakeEvent = { target: { name, value } };
		return this.handleChange(fakeEvent);
	}

	needUpdate = (store, errors, handleChange, key = null) => {
		let needUpdate = false;
		if (this.store !== store) {
			this.store = store;
			needUpdate = true;
		}
		if (this.errors !== errors) {
			this.errors = errors;
			needUpdate = true;
		}
		if (key != null && this.keyPrefix !== key) {
			this.keyPrefix = key;
			needUpdate = true;
		}
		if (this.handleChange !== handleChange)
			this.handleChange = handleChange;
		return needUpdate;
	}

	getKey = (key) => (this.keyPrefix ? `${this.keyPrefix}.${key}` : key)

	getValue = (key, params) => (
		key.split('.').reduce((props, step) => props[step], this.store)
	)

	getProps = (props) => (
		this.defaultProps ? { ...this.defaultProps, ...props } : props
	)

	displayErrors = (key) => (
		this.errors[key] ? this.errors[key].join('<br>') : ''
	)

	text = (key, label, props = {}) => (
		<TextField
			label={label}
			name={this.getKey(key)}
			value={this.getValue(key, props) || ''}
			onChange={this.handleChange}
			error={Boolean(this.errors[key])}
			helperText={this.displayErrors(key)}
			{...this.getProps(props)}
		/>
	)

	number = (key, label, props = {}) => (
		<TextField
			label={label}
			name={this.getKey(key)}
			value={this.getValue(key, props) || 0}
			onChange={this.handleChange}
			type="number"
			error={Boolean(this.errors[key])}
			helperText={this.displayErrors(key)}
			{...this.getProps(props)}
		/>
	)

	boolean = (key, label, props = {}) => (
		<FormControlLabel
			label={label}
			// error={Boolean(this.errors[key])}
			// helperText={this.displayErrors(key)}
			control={
				<Checkbox
					name={this.getKey(key)}
					checked={this.getValue(key, props) || false}
					onChange={this.handleChange}
				/>
			}
		/>
	)

	datetime = (key, label, props = {}) => (
		<KeyboardDateTimePicker
			label={label}
			value={this.getValue(key, props) || new Date()}
			onChange={this.handleChangeDatetime(this.getKey(key))}
			format="yyyy/MM/dd hh:mm:ss"
			showTodayButton
			{...this.getProps(props)}
		/>
	)

	select = (key, label, choices, props = {}) => (
		<FormControl error={Boolean(this.errors[key])}>
			<InputLabel htmlFor={this.getKey(key)}>{label}</InputLabel>
			<Select
				name={this.getKey(key)}
				value={this.getValue(key, props) || ''}
				onChange={this.handleChange}
				labelId={this.getKey(key)}
				// helperText={this.displayErrors(key)}
				{...this.getProps(props)}
			>
				{choices.map(choice => (
					<MenuItem
						key={choice.value || choice}
						value={choice.value || choice}
					>
						{choice.label || choice}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default FieldGenerator;
