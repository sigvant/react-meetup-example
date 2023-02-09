import NewMeetupForm from '@/components/meetups/NewMeetupForm';
import Head from 'next/head';
import { useRouter } from 'next/router';

function NewMeetupPage() {
	const router = useRouter();
	async function addMeetupHandler(meetupData) {
		// here is where we send request to the database
		const response = await fetch('/api/new-meetup', {
			method: 'POST',
			body: JSON.stringify(meetupData),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		console.log(data);
		router.replace('/');
	}
	return (
		<>
			<Head>
				<title>Add a new Meetup</title>
				<meta
					name="description"
					content="Create e meetup and add some new networking opportunities"
				/>
			</Head>
			<NewMeetupForm onAddMeetup={addMeetupHandler} />
		</>
	);
}

export default NewMeetupPage;
