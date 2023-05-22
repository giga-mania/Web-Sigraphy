import {FC} from 'react';
import Button from "@/components/ui/Button";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

interface Props {

}

const Dashboard = async ({}) => {

    const session = await getServerSession(authOptions)

    return (
        <div>
            <Button>BTN</Button>
            <pre>{JSON.stringify(session)}</pre>
        </div>
    );
}

export default Dashboard