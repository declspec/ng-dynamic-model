import * as util from '../../util';

const RemovedFlag = '$$removed';
const FilterContext = { '$util': util };

function findBlockIndexByValue(blocks, value) {
    for(let i = 0, j = blocks.length; i < j; ++i) {
        if (blocks[i].value === value)
            return i;
    }

    return -1;
}

FieldRepeatForDirective.$inject = [ '$q', '$animate', '$parse', 'ModelBuilder' ];

export function FieldRepeatForDirective(q, animate, parse, modelBuilder) {
    return {
        restrict: 'A',
        transclude: 'element',
        terminal: true,
        priority: 10,
        require: '^^dynamicModel',
    
        compile: function($element, attrs) {
            return function(scope, $element, attrs, ctrl, transclude) {
                const field = ctrl.fieldFor(scope, attrs['fieldRepeatFor'], 'field-repeat-for');
                const filter = attrs['filter'] && parse(attrs['filter']);

                let lastBlocks = [];
    
                field.addAsyncValidator((f, addError) => {
                    return q.all(lastBlocks.map(b => b.model.validate()))
                        .then(results => results.every(r => r));
                });

                field.watch(onFieldUpdated);
                onFieldUpdated(field.value());
    
                function onFieldUpdated(newValue) {
                    let nextBlocks = [];
    
                    if (Array.isArray(newValue)) {
                        for(let i = 0, j = newValue.length; i < j; ++i) {
                            const value = newValue[i];

                            if (filter && !filter(FilterContext, value))
                                continue;
                                
                            const idx = findBlockIndexByValue(lastBlocks, value);

                            const nextBlock = idx >= 0 
                                ? lastBlocks.splice(idx, 1)[0] // previous block
                                : { value, model: createModel(field, value) }; // new block since last run  

                            // Keep track of the reference in relation to the source data set.
                            nextBlock.index = i;
                            nextBlocks.push(nextBlock);
                        }
                    }
    
                    // Remove blocks that weren't transferred
                    for(let i = 0, j = lastBlocks.length; i < j; ++i) {
                        const block = lastBlocks[i];
                        animate.leave(block.clone);
    
                        if (block.clone[0].parentNode)
                            block.clone[0][RemovedFlag] = true;
    
                        block.scope.$destroy();
                    }

                    let previousNode = $element[0];
    
                    for(let i = 0, j = nextBlocks.length; i < j; ++i) {
                        const block = nextBlocks[i];
    
                        if (!block.scope) {
                            // Brand new block
                            transclude((clone, scope) => {
                                block.scope = scope;
                                animate.enter(clone, null, previousNode);
                                previousNode = clone[0];
                                block.clone = clone;
                                updateBlock(block, i, nextBlocks.length, newValue.length);
                            });
                        }
                        else {
                            // Re-use the element
                            let nextNode = previousNode;
    
                            do {
                                nextNode = previousNode.nextSibling;
                            } while(nextNode && nextNode[RemovedFlag]);
    
                            if (block.clone[0] !== nextNode) {
                                // Order for this node doesn't match
                                animate.move(block.clone[0], null, previousNode);
                            }
    
                            previousNode = block.clone[0];
                            updateBlock(block, i, nextBlocks.length, newValue.length);
                        }
                    }
    
                    lastBlocks = nextBlocks;
                }
            };
    
            function updateBlock(block, index, currentBlocks, totalBlocks) {
                block.scope.$model = block.model;
                block.scope.$index = index;
                block.scope.$count = currentBlocks;
                block.scope.$sourceIndex = block.index;
                block.scope.$sourceCount = totalBlocks;
            }

            function createModel(parentField, state) {
                const model = modelBuilder.build(state);
                model.subscribe(() => parentField.setDirty(true));
                return model;
            }
        }
    }; 
}