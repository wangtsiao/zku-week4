import styles from '../styles/Home.module.css'

import { Text, Input, Spacer, Button, Popover, Textarea, Grid } from "@nextui-org/react"
import { useEffect, useState } from 'react'

import { string, number, object } from 'yup'

import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json"

import { Contract, providers, utils } from "ethers"


export default function Home() {

    const [eventMsg, setEventMsg] = useState('');

    const onChainEvent = async (msg) => {
        setEventMsg(eventMsg === "" ? msg : eventMsg + "\n" + msg)
    }

    useEffect(() => {
        const provider = new providers.JsonRpcProvider("http://localhost:8545")
        const contract = new Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", Greeter.abi, provider)
        
        // const contractOwner = contract.connect(provider.getSigner())
    
        const listener = (e) => {
            console.log("NewGreeting Event: ");
            console.log(e);
            const msg = utils.parseBytes32String(e)
            console.log(msg);
            onChainEvent(msg);
        };
        contract.on("NewGreeting", listener)
    
        console.log("listener init...");

        return () => {
            contract.off("NewGreeting", listener);
        }
    }, [ ]);


    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [address, setAddress] = useState('');
    const [msgAfterSubmit, setMsgAfterSubmit] = useState('');



    const onSubmit = async (e) => {
        let userSchema = object({
            name: string()
                .required("You must sepcify a name"),
            age: number()
                .required("You must specify a age")
                .typeError("Age should be number")
                .positive("Age should be positive")
                .integer("Age should be integer")
                .lessThan(131, "Max age is 130"),
            address: string()
                .required("You must specify a address")
        });

        try {
            const user = await userSchema.validate({ name, age, address });
            console.log(user);
            setMsgAfterSubmit(`Entered user: ${user.name}`)
        }
        catch (err) {
            // alert(err);
            console.log(err);
            if (err instanceof Error) {
                setMsgAfterSubmit("Error: " + err.toString())
            }
        }
    };

    return (
        <>

            <Grid.Container className={styles.main}>
                <Text
                    h1
                    size={60}
                    css={{
                        textGradient: "45deg, $blue600 -20%, $pink600 50%",
                    }}
                    weight="bold"
                >
                    Let&apos;s {' '} Make {' '} the {' '} Web
                </Text>

                <Text
                    h1
                    size={60}
                    css={{
                        textGradient: "45deg, $yellow600 -20%, $red600 100%",
                    }}
                    weight="bold"
                >
                    Better
                </Text>
                <Spacer y={1.5} />

                <Grid.Container className={styles.titleX} css={{ mt: '4px' }} gap={2.5}>
                    <Grid>
                        <Input clearable bordered labelPlaceholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                        <Spacer y={1.5} />

                        {age !== 0 ?
                            <Input clearable bordered labelPlaceholder="Age"
                                value={age}
                                onChange={(e) => setAge(parseInt(e.target.value))} />
                            :
                            <Input clearable bordered labelPlaceholder="Age"
                                value={undefined}
                                onChange={(e) => setAge(parseInt(e.target.value))} />
                        }
                        <Spacer y={1.5} />

                        <Input clearable bordered labelPlaceholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                        <Spacer y={1.5} />



                        <Popover>
                            <Popover.Trigger>
                                <Button auto flat onPress={onSubmit}>Submit</Button>
                            </Popover.Trigger>
                            <Popover.Content>
                                <Text css={{ p: "$10" }}>{msgAfterSubmit}</Text>
                            </Popover.Content>
                        </Popover>

                    </Grid>

                    <Grid>
                        <Textarea readOnly labelPlaceholder="events on chain" status="secondary" value={eventMsg} />
                    </Grid>

                </Grid.Container>




            </Grid.Container>

        </>
    )
}
