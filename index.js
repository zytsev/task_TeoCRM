const inputsList = document.querySelectorAll('.input_container');

inputsList.forEach((input) => {
    input.onmousedown = (event) => {
        const path = event.composedPath();
        if (!path.some((el) => el.classList?.contains('move'))) return;
        const allRows = document.querySelectorAll('.form_row');
        const originalRow = path.find((el) => el.classList && el.classList.contains('form_row'));
        const indexInput = Array.from(originalRow.children).indexOf(input);

        let shiftX = event.clientX - input.getBoundingClientRect().left;
        let shiftY = event.clientY - input.getBoundingClientRect().top;

        let addedSkeletons = false;
        let skeletons = [];
        let targetField = null;

        function createSkeletons() {
            if (addedSkeletons) return;

            input.classList.add('in_motion');
            document.body.appendChild(input);

            allRows.forEach((row) => {
                const skeleton = document.createElement('div');
                skeleton.classList.add('skeleton');
                if (row !== originalRow) {
                    if (row.children.length < 3) {
                        row.append(skeleton);
                    }
                } else {
                    if (row.children.length < indexInput) {
                        row.appendChild(skeleton);
                    }
                    row.insertBefore(skeleton, row.children[indexInput]);
                }
                skeletons.push(skeleton);
            });

            inputsList.forEach((el) => el !== input && el.classList.add('another'));

            addedSkeletons = true;
        }

        function moveAt(pageX, pageY) {
            input.style.left = pageX - shiftX + 'px';
            input.style.top = pageY - shiftY + 'px';
        }

        function swapElements(parent, el1, el2) {
            if (!el1 || !el2 || el1 === el2) return;
            const temp = document.createElement('div');
            parent.insertBefore(temp, el1);
            parent.insertBefore(el1, el2);
            parent.insertBefore(el2, temp);
            parent.removeChild(temp);
        }

        function onMouseMove(event) {
            createSkeletons();
            moveAt(event.pageX, event.pageY);

            const elementsBelow = document.elementsFromPoint(event.clientX, event.clientY);
            targetField = elementsBelow?.find((elem) => elem.classList?.contains('skeleton'));
            const otherInput = elementsBelow.find((elem) => elem.classList.contains('another'));
            const rowBelow = otherInput?.parentElement;
            const skeletonInRow = rowBelow?.querySelector('.skeleton');

            if (otherInput && skeletonInRow) {
                swapElements(rowBelow, otherInput, skeletonInRow);
            }
            skeletons.forEach((skel) => {
                skel.classList.toggle('chosen', skel === targetField);
            });
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            input.classList.remove('in_motion');

            targetField ? targetField.replaceWith(input) : originalRow.children[indexInput]?.replaceWith(input);

            skeletons.forEach((skel) => skel.remove());

            inputsList.forEach((el) => el.classList.remove('another'));

            input.onmouseup = null;
        }

        document.addEventListener('mousemove', onMouseMove);

        input.onmouseup = onMouseUp;
    };

    input.ondragstart = function () {
        return false;
    };
});
