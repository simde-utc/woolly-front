import React from 'react';
import {
	TextField, Checkbox, FormControlLabel,
	FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';


class FieldGenerator {

	// TODO Finish error texts

	constructor(store, errors, handleChange, keyPrefix = null) {
		this.store = store;
		this.errors = errors;
		this.handleChange = handleChange;
		this.keyPrefix = keyPrefix;
	}

	handleChangeDatetime = name => value => {
		const fakeEvent = { target: { name, value } };
		return this.handleChange(fakeEvent);
	}

	needUpdate = (store, errors, handleChange) => {
		let needUpdate = false;
		if (this.store !== store) {
			this.store = store;
			needUpdate = true;
		}
		if (this.errors !== errors) {
			this.errors = errors;
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
			{...props}
		/>
	)

	integer = (key, label, props = {}) => (
		<TextField
			label={label}
			name={this.getKey(key)}
			value={this.getValue(key, props) || 0}
			onChange={this.handleChange}
			type="number"
			error={Boolean(this.errors[key])}
			helperText={this.displayErrors(key)}
			{...props}
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
			{...props}
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
