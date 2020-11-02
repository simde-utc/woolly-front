import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { messagesActions } from '../redux/actions';


export function Message({ title, details=null, severity="info", onClose, ...props }) {
	return (
		<Snackbar
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			autoHideDuration={6000} onClose={onClose} {...props}
		>
			<Alert onClose={onClose} severity={severity}>
				{details ? (
					<React.Fragment>
						<AlertTitle>{title}</AlertTitle>
						{details}
					</React.Fragment>
				) : title}
			</Alert>
		</Snackbar>
	);
}


export default function MessageSystem({ ...props }) {
	const dispatch = useDispatch();
	const messages = useSelector(store => store.messages);


	const handleCloseMessage = id => event => {
		dispatch(messagesActions.popMessage(id))
	}

	return (
		<React.Fragment>
			{Object.values(messages).map(message => (
				<Message
					open
					key={message.id}
					title={message.title}
					details={message.details}
					severity={message.severity}
					onClose={handleCloseMessage(message.id)}
				/>
			))}
		</React.Fragment>
	);
}
