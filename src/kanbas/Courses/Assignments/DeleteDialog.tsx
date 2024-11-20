export default function DeleteDialog({
    dialogTitle,
    assignmentName,
    assignmentId,
    deleteAssignment,
}: {
    dialogTitle: string;
    assignmentName: string;
    assignmentId: string;
    deleteAssignment: (name: string) => void;
}) {
    return (
        <div
            id={`delete-modal-${assignmentId}`}
            aria-labelledby={`delete-modal-${assignmentId}-label`}
            className="modal fade"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1
                            className="modal-title fs-5"
                            id="staticBackdropLabel"
                        >
                            {dialogTitle}
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <h1 className="form-control">{assignmentName}</h1>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            className="btn btn-danger"
                            onClick={() => deleteAssignment(assignmentId)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
