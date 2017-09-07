import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

const DownshiftSectioned = ({items, itemToString, Result, onFocus, isOpen, ...others}) => {
    return (
        <Downshift itemToString={itemToString} {...others}>
            {({
                getInputProps,
                getItemProps,
                selectedItem,
                highlightedIndex
            }) => {
                return (
                    <div>
                        <input {...getInputProps({
                            onFocus: onFocus,
                            placeholder: 'Search...'
                        })} />
                        {isOpen
                            ? <div>
                                {items.reduce((itemsArray, section, sectionIndex) => {
                                    if (section.results.length > 0) {
                                        itemsArray.sections.push(
                                            <div key={sectionIndex}>
                                                <div>{section.title}</div>
                                                {section.results.map((result, resultIndex) => {
                                                    const totalIndex = itemsArray.itemIndex++;
                                                    return (
                                                        <div
                                                            {...getItemProps({
                                                                key: resultIndex,
                                                                index: totalIndex,
                                                                item: result,
                                                                className: "search-result",
                                                                style: {
                                                                    backgroundColor:
                                                                        highlightedIndex === totalIndex ? 'lightgray' : 'white',
                                                                    fontWeight: selectedItem === result ? 'bold' : 'normal'
                                                                }
                                                            })}
                                                        >
                                                            <Result result={result}/>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }
                                    return itemsArray;
                                }, {sections: [], itemIndex: 0}).sections}
                            </div>
                            : null}
                    </div>
                );
            }}
        </Downshift>
    );
};

DownshiftSectioned.propTypes = {
    items: PropTypes.array.isRequired,
    itemToString: PropTypes.func.isRequired,
    Result: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default DownshiftSectioned;