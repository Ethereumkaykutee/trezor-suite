import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors, variables, Dropdown, Timerange, TimerangeProps } from '@trezor/components';
import { Translation } from '@suite-components';
import { useGraph } from '@suite-hooks';
import { GraphRange } from '@wallet-types/graph';
import { getFormattedLabel } from '@wallet-utils/graphUtils';
import { startOfToday, endOfToday, subDays, subMonths, subYears, differenceInMonths } from 'date-fns';

const Wrapper = styled.div`
    display: flex;
    /* margin-bottom: 8px; */
`;

const RangeItem = styled.div<{ selected: boolean; separated?: boolean }>`
    display: flex;
    font-size: ${variables.FONT_SIZE.SMALL};
    text-align: center;
    font-weight: ${props => (props.selected ? 600 : 500)};
    color: ${props => (props.selected ? colors.NEUE_TYPE_DARK_GREY : colors.NEUE_TYPE_LIGHT_GREY)};
    cursor: pointer;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;

    & + & {
        margin-left: 12px;
    }

    ${props =>
        props.separated &&
        `
        border-left: 1px solid ${colors.NEUE_TYPE_LIGHTER_GREY};
        padding-left: 15px;
        margin-left: 15px;
        text-transform: capitalize;
    `};
`;

const END_OF_TODAY = endOfToday();
const RANGES = [
    {
        label: 'day',
        startDate: startOfToday(),
        endDate: END_OF_TODAY,
        groupBy: 'day',
    },
    {
        label: 'week',
        startDate: subDays(END_OF_TODAY, 7),
        endDate: END_OF_TODAY,
        groupBy: 'day',
    },
    {
        label: 'month',
        startDate: subMonths(END_OF_TODAY, 1),
        endDate: END_OF_TODAY,
        groupBy: 'day',
    },
    {
        label: 'year',
        startDate: subYears(END_OF_TODAY, 1),
        endDate: END_OF_TODAY,
        groupBy: 'month',
    },
    {
        label: 'all',
        startDate: null,
        endDate: null,
        groupBy: 'month',
    },
] as const;

interface Props {
    onSelectedRange?: (range: GraphRange) => void;
    className?: string;
}

const RangeSelector = (props: Props) => {
    const { selectedRange, setSelectedRange } = useGraph();
    const { customTimerangeStart, setCustomTimerangeStart } = useState(null);
    const { customTimerangeEnd, setCustomTimerangeEnd } = useState(null);
    const setCustomTimerange = (startDate: Date, endDate: Date) => {
        setCustomTimerangeStart(startDate);
        setCustomTimerangeEnd(endDate);
    };

    useEffect(() => {
        if (customTimerangeStart && customTimerangeEnd) {
            const range = {
                label: 'range',
                startDate: customTimerangeStart,
                endDate: customTimerangeEnd,
                groupBy:
                    differenceInMonths(customTimerangeStart, customTimerangeEnd) >= 1
                        ? 'month'
                        : 'day',
            };
            setSelectedRange(range);
            if (props.onSelectedRange) {
                props.onSelectedRange(range);
            }
        }
    }, [customTimerangeStart, customTimerangeEnd]);

    return (
        <Wrapper className={props.className}>
            {RANGES.map(range => (
                <RangeItem
                    key={range.label}
                    selected={range.label === selectedRange.label}
                    onClick={() => {
                        setSelectedRange(range);
                        if (props.onSelectedRange) {
                            props.onSelectedRange(range);
                        }
                    }}
                >
                    {getFormattedLabel(range.label)}
                </RangeItem>
            ))}
            <Dropdown
                verticalPadding={0}
                alignMenu="right"
                items={[
                    {
                        key: 'group1',
                        options: [
                            {
                                noPadding: true,
                                noHover: true,
                                key: 'graphView',
                                label: (
                                    <Timerange
                                        onChange={(startDate, endDate) =>
                                            setCustomTimerange(startDate, endDate)
                                        }
                                    />
                                ),
                                callback: () => false,
                            },
                        ],
                    },
                ]}
            >
                <RangeItem selected={selectedRange.label === 'range'} separated>
                    <Translation id="TR_RANGE" />
                </RangeItem>
            </Dropdown>
        </Wrapper>
    );
};

export default RangeSelector;
