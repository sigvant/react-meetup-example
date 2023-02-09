// when you import here things that will be executed on the serverside bundle
// next will bundle them separately so you dont worry
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
	return (
		<>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list og highly active React meetups!"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</>
	);
}

// you should use this only if your data changes
// several times a second or more
// export async function getServerSideProps(context) {
// 	// context brings req and res
// 	const req = context.req;
// 	const res = context.res;

// 	// fetch data from an API
// 	return {
// 		props: {
// 			meetups: DUMMY_DATA
// 		}
// 	};
// }

// this should be used if you need refresh for every
// request / page load
export async function getStaticProps() {
	// fetch data from an API
	const client = await MongoClient.connect(process.env.MONGO_STRING);

	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();
	// usually this a complex object that you need to map

	client.close();

	// always return an object here
	return {
		// this sets the comp props
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString()
			}))
		},
		revalidate: 1
	};
	// this is one of the best tricks of NEXTJS
}

export default HomePage;
