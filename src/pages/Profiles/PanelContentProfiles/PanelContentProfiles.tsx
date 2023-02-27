import Button from "../../../components/Button/Button";

interface IPanelContentProfiles {
    data: FPData[],
    setOpen: (open: boolean) => void,
}

function PanelContentProfiles(props: IPanelContentProfiles) {
    const { setOpen, data } = props;

    console.log(data)
    return (
        <div className='panel__content panel__content--profiles'>
            <div className='panel__content__header'>
                <Button onClick={() => setOpen(false)}
                    variant={'close'}>

                </Button>
            </div>
        </div>
    )
}

export default PanelContentProfiles;