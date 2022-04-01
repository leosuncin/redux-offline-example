import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { acceptUpdate, selectHasPendingUpdate } from './swSlice';

function WavingHand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7.03 4.95L3.49 8.49c-3.32 3.32-3.32 8.7 0 12.02s8.7 3.32 12.02 0l6.01-6.01a2.517 2.517 0 0 0-.39-3.86l.39-.39c.97-.97.97-2.56 0-3.54c-.16-.16-.35-.3-.54-.41a2.497 2.497 0 0 0-3.72-3.05a2.517 2.517 0 0 0-3.88-.42l-2.51 2.51a2.493 2.493 0 0 0-3.84-.39zm1.41 1.42c.2-.2.51-.2.71 0c.2.2.2.51 0 .71l-3.18 3.18a3 3 0 0 1 0 4.24l1.41 1.41a5.004 5.004 0 0 0 1.12-5.36l6.3-6.3c.2-.2.51-.2.71 0s.2.51 0 .71l-4.6 4.6l1.41 1.41l6.01-6.01c.2-.2.51-.2.71 0c.2.2.2.51 0 .71l-6.01 6.01l1.41 1.41l4.95-4.95c.2-.2.51-.2.71 0c.2.2.2.51 0 .71l-5.66 5.66l1.41 1.41l3.54-3.54c.2-.2.51-.2.71 0c.2.2.2.51 0 .71l-6 6.01c-2.54 2.54-6.65 2.54-9.19 0s-2.54-6.65 0-9.19l3.53-3.54zM23 17c0 3.31-2.69 6-6 6v-1.5c2.48 0 4.5-2.02 4.5-4.5H23zM1 7c0-3.31 2.69-6 6-6v1.5C4.52 2.5 2.5 4.52 2.5 7H1z"
      ></path>
    </svg>
  );
}

function UpdateAlert() {
  const dispatch = useAppDispatch();
  const hasPendingUpdate = useAppSelector(selectHasPendingUpdate);

  return (
    <div
      className="alert alert-info"
      role="alert"
      style={hasPendingUpdate ? {} : { display: 'none' }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        <span>
          <WavingHand className="me-3" role="img" aria-label="Hey:" />
          There is a new version available, do you want to reload the app?
        </span>

        <div className="btn-group">
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              dispatch(acceptUpdate(true));
            }}
          >
            Reload
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              dispatch(acceptUpdate(false));
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateAlert;
