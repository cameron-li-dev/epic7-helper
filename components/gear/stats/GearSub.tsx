import { Component } from "react";
import { Box, SxStyleProp } from 'rebass'
import statObject from "../game/statObject";
import { subArray } from '../game/subArray'

const subStyle = {
    style: {
        gridRow: 1,
        padding: '0px 5px 0px 5px',
    }
}

export default class GearSub extends Component<{}, {id : string, stat : statObject}> {

    stat : statObject;
    id : string;

    constructor(props) {
        super(props);
        this.id = props.id;
        this.stat = props.stat;
    }

    render() {

        return (
            <Box style={{
                MozUserSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none"
            }}>
                <Box sx={{
                    display: 'inline-grid',
                    background: 'white',               
                }}>
                    <Box id={this.id} sx={subStyle.style}>
                        {this.stat.name}
                    </Box>
                    <Box id="Amount" sx={subStyle.style}>
                        Two
                    </Box>
                </Box>
            </Box>
        )
    }
}