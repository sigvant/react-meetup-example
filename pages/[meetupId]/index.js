import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '@/components/meetups/MeetupDetail';

function MeetupDetails(props) {
	return (
		<>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta
					name="description"
					content={props.meetupData.description}
				/>
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</>
	);
}

export async function getStaticPaths() {
	// this object describes the dynamic parameter values
	// that we use to generate the page we are rendering
	const client = await MongoClient.connect(process.env.MONGO_STRING);

	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
	// usually this a complex object that you need to map

	client.close();

	return {
		// false means our paths contain ALL of the supported
		// true means next will try to generate a page for the path
		fallback: false,
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() }
		}))
	};
}

export async function getStaticProps(context) {
	// get data from params
	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect(process.env.MONGO_STRING);

	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({
		_id: new ObjectId(meetupId)
	});

	// usually this a complex object that you need to map

	client.close();

	// fetch data for a single meetup
	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description
			}
		}
	};
}

export default MeetupDetails;
