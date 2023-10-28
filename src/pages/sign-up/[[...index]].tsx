import {SignUp} from '@clerk/nextjs';

export default function Page() {
    return (
        <div className="container flex justify-center items-center h-screen">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: 'mb-64',
                    },
                }}
            />
        </div>
    );
}
