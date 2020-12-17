import { Box } from 'rebass'
import GearSub from './GearSub'
import { subArray } from '../game/subArray'
import { Component } from 'react';
import statObject from '../game/statObject';

const subStyle = {
    wrapper: {
        userSelect: 'none',
        MozUserSelect: 'none',
        KhtmlUserSelect: 'none',
        WebkitUserSelect: 'none',
        minWidth: '300px',
    },
    currentDisplay: {
        transition: 'display .2s, visibility .2s, height .2s, opacity .2s'
    },
    subContainer: {
        selections: {
            display: "inline-grid",
            marginTop: '10px',
            overflow: 'hidden',
            height: 'auto',
            hidden: {
                transition: 'max-height .2s, visibility .2s, opacity .2s',
                visibility: "hidden",
                maxHeight: '0',
                opacity: '0',
            },
            revealed: {
                transition: 'max-height .2s, visibility .5s, opacity .5s',
                visibility: "visible",
                maxHeight: '500px',
                opacity: '1',
            },
        },
        reveal: {
            width: '100%',
            marginTop: '10px',
            height: ["6vh", "5vh", "4vh"],
            background: 'black',
            ":hover": {
                cursor: "pointer",
            }
        }

    }

}

function subStats(stats : number[]) : GearSub[] {
    let subStats : GearSub[] = [];
    for (let i = 0; i < stats.length; i++) {
        subStats.push(new GearSub({key: ("subContainer-subStats-" + i), id: ("subContainer-subStats-" + i), stat:subArray[stats[i]]}))
    }
    return subStats;
}

/*
export interface SubContainer {
    rarity: number
    enhancements: number  
}

const subContainer: SubContainer = {
    rarity: 1,
    enhancements: 5,
    stats: [1,2,3]
}
*/


export default class SubContainer extends Component {

    private rarity : number = 4;
    private enhancements : number = 0;
    private selectedStats : number[] = [];
    private subStatDisplay : GearSub[];

    private displayingSelections : boolean = false;
    
    constructor(props) {
        super(props);
        this.selectedStats = [5, 2, 3, 4];
        this.subStatDisplay = subStats(this.selectedStats);
    }

    getStats() : statObject[] {
        let stats : statObject[] = [];
        for (let i = 0 ; i < this.selectedStats.length; i++) {
            stats.push(subArray[this.selectedStats[i]])
        }
        return stats;
    }

    getValues() : number[] {
        let values : number[] = [];
        for (let i = 0 ; i < this.subStatDisplay.length; i++) {
            values.push(this.subStatDisplay[i].returnValue())
        }
        return values;
    }

    getEnhancement() : number {
        return this.enhancements;
    }

    /**
     * Updates currently selected stats
     * If current one is clicked, removes from selection
     * If new one, add it to the selections granted less than max currently selected
     * @param id the id of the selected stat div
     * @param stat the stat selected (index in subArray array)
     */
    handleStat(id : string, stat : number) {
        let substat = document.getElementById(id);
        let change = false;
        if (this.selectedStats.includes(stat)) {
            let tempSelected : number[] = [];
            let remove = this.selectedStats.indexOf(stat);
            for (let i = 0; i < this.selectedStats.length; i++) {
                if (i != remove) {
                    tempSelected.push(this.selectedStats[i]);
                }
            }
            this.selectedStats = tempSelected;
            substat.style.background = "blue";
            change = true;
        } else {
            if (this.selectedStats.length < this.rarity) {
                this.selectedStats.push(stat);
                substat.style.background = "pink";
                change = true;
            }
        }
        this.refreshStats();
    }

    /**
     * Refresh all stats in case some are hidden or displayed incorrectly
     */
    refreshStats() {
        // Update stats to match selected stat objects
        for (let i = 0 ; i < this.selectedStats.length; i++) {
            this.subStatDisplay[i].changeStat(subArray[this.selectedStats[i]]);
        }

        // Refresh stats to make sure they're all visible
        for (let i = 0; i < this.subStatDisplay.length; i++) {
            this.subStatDisplay[i].toggleDisplay(true);
        }

        // If max stats not selected, hide hidden ones
        let selectedLength = this.selectedStats.length;
        var displayLength = this.subStatDisplay.length;
        if (selectedLength < displayLength) { // Get difference in length to find out how many are missing
            let difference = displayLength - selectedLength;
            for (let j = displayLength - difference; j < displayLength; j++) {
                this.subStatDisplay[j].toggleDisplay(false);
            }
        }
    }

    /**
     * Creates the selection div
     * Creates a button for each substat in the subArray array
     * Stores in a grid for display
     */
   createSelect() {
    let selectStat = [];
    let maxPerColumn = 5;
    let currentColumn = 1;
    let currentRow = 1;
    for (let i = 0; i < subArray.length; i++) {
        let status : string = "blue";
        if (this.selectedStats.includes(i)) {
            status = "pink";
        }

        selectStat.push(
            <Box key={i} sx={{
                gridColumn: currentColumn,
                gridRow: currentRow,
                paddingX: '10px',
                paddingY: '5px',
                margin: '2px',
                textAlign: 'center',
                background: status,
                borderRadius: '2px',
                ':hover': {
                    cursor: "pointer",
                },
            }} id={"subContainer-selection-" + i} onClick={() => this.handleStat("subContainer-selection-" + i, i)}>
                {subArray[i].name}
            </Box>
        )
        currentColumn++;
        if (currentColumn > maxPerColumn) {
            currentColumn = 1;
            currentRow++;
        }
    }

    return selectStat;
    }

    /**
     * Set the number of enhancements
     * @param newEnhance New number of enhancements
     */
    updateEnhance(newEnhance : number) {
        this.enhancements = newEnhance/3;
    }

    render() {
        var currentStats = [];
        for (let i = 0; i < this.selectedStats.length; i++) {
            currentStats.push(
                <Box key={"subContainer-substat-" + i} id={"subContainer-substat-" + i}>
                    {this.subStatDisplay[i].render()}
                </Box>
                );
        }
        var select = this.createSelect();

        return (
            <Box sx={subStyle.wrapper}>
                <Box sx={{
                    transition: 'height .2s',
                }}>
                    {currentStats}
                </Box>
                <Box>
                    <Box id="subContainer-selections" className="selections" style={{visibility: "hidden", maxHeight: '0', height: 'auto', opacity: '0',}} sx={subStyle.subContainer.selections}>
                        {select}
                    </Box>

                    <Box className="revealSelections" sx={subStyle.subContainer.reveal} onClick={() => {
                        var reveal = document.getElementById("subContainer-selections");
                        if (reveal.style.visibility == "visible") {
                            reveal.style.transition = subStyle.subContainer.selections.hidden.transition;
                            reveal.style.visibility = subStyle.subContainer.selections.hidden.visibility;
                            reveal.style.maxHeight = subStyle.subContainer.selections.hidden.maxHeight;
                            reveal.style.opacity = subStyle.subContainer.selections.hidden.opacity;

                        } else {
                            reveal.style.transition = subStyle.subContainer.selections.revealed.transition;
                            reveal.style.visibility = subStyle.subContainer.selections.revealed.visibility;
                            reveal.style.maxHeight = subStyle.subContainer.selections.revealed.maxHeight;
                            reveal.style.opacity = subStyle.subContainer.selections.revealed.opacity;
                        }
                    }}>
                    </Box>
                </Box>
            </Box>
        )
    }

}