import React from 'react'

type ExpandedEventHandler<E extends React.SyntheticEvent<any>, A> = {
    bivarianceHack(event: E, ...expandedArgs: A[]): void
}["bivarianceHack"]

type ExpandedReactEventHandler<A, T = Element> = ExpandedEventHandler<React.SyntheticEvent<T>, A>;

type ExpandedClipboardEventHandler<A, T = Element> = ExpandedEventHandler<React.ClipboardEvent<T>, A>;
type ExpandedCompositionEventHandler<A, T = Element> = ExpandedEventHandler<React.CompositionEvent<T>, A>;
type ExpandedDragEventHandler<A, T = Element> = ExpandedEventHandler<React.DragEvent<T>, A>;
type ExpandedFocusEventHandler<A, T = Element> = ExpandedEventHandler<React.FocusEvent<T>, A>;
type ExpandedFormEventHandler<A, T = Element> = ExpandedEventHandler<React.FormEvent<T>, A>;
type ExpandedChangeEventHandler<A, T = Element> = ExpandedEventHandler<React.ChangeEvent<T>, A>;
type ExpandedKeyboardEventHandler<A, T = Element> = ExpandedEventHandler<React.KeyboardEvent<T>, A>;
type ExpandedMouseEventHandler<A, T = Element> = ExpandedEventHandler<React.MouseEvent<T>, A>;
type ExpandedTouchEventHandler<A, T = Element> = ExpandedEventHandler<React.TouchEvent<T>, A>;
type ExpandedPointerEventHandler<A, T = Element> = ExpandedEventHandler<React.PointerEvent<T>, A>;
type ExpandedUIEventHandler<A, T = Element> = ExpandedEventHandler<React.UIEvent<T>, A>;
type ExpandedWheelEventHandler<A, T = Element> = ExpandedEventHandler<React.WheelEvent<T>, A>;
type ExpandedAnimationEventHandler<A, T = Element> = ExpandedEventHandler<React.AnimationEvent<T>, A>;
type ExpandedTransitionEventHandler<A, T = Element> = ExpandedEventHandler<React.TransitionEvent<T>, A>;

export interface ExpandedEventHandlers<A, T = Element> {
    onCopy?: ExpandedClipboardEventHandler<A, T> | undefined
    onCopyCapture?: ExpandedClipboardEventHandler<A, T> | undefined
    onCut?: ExpandedClipboardEventHandler<A, T> | undefined
    onCutCapture?: ExpandedClipboardEventHandler<A, T> | undefined
    onPaste?: ExpandedClipboardEventHandler<A, T> | undefined
    onPasteCapture?: ExpandedClipboardEventHandler<A, T> | undefined
    onCompositionEnd?: ExpandedCompositionEventHandler<A, T> | undefined
    onCompositionEndCapture?: ExpandedCompositionEventHandler<A, T> | undefined
    onCompositionStart?: ExpandedCompositionEventHandler<A, T> | undefined
    onCompositionStartCapture?: ExpandedCompositionEventHandler<A, T> | undefined
    onCompositionUpdate?: ExpandedCompositionEventHandler<A, T> | undefined
    onCompositionUpdateCapture?: ExpandedCompositionEventHandler<A, T> | undefined
    onFocus?: ExpandedFocusEventHandler<A, T> | undefined
    onFocusCapture?: ExpandedFocusEventHandler<A, T> | undefined
    onBlur?: ExpandedFocusEventHandler<A, T> | undefined
    onBlurCapture?: ExpandedFocusEventHandler<A, T> | undefined
    onChange?: ExpandedFormEventHandler<A, T> | undefined
    onChangeCapture?: ExpandedFormEventHandler<A, T> | undefined
    onBeforeInput?: ExpandedFormEventHandler<A, T> | undefined
    onBeforeInputCapture?: ExpandedFormEventHandler<A, T> | undefined
    onInput?: ExpandedFormEventHandler<A, T> | undefined
    onInputCapture?: ExpandedFormEventHandler<A, T> | undefined
    onReset?: ExpandedFormEventHandler<A, T> | undefined
    onResetCapture?: ExpandedFormEventHandler<A, T> | undefined
    onSubmit?: ExpandedFormEventHandler<A, T> | undefined
    onSubmitCapture?: ExpandedFormEventHandler<A, T> | undefined
    onInvalid?: ExpandedFormEventHandler<A, T> | undefined
    onInvalidCapture?: ExpandedFormEventHandler<A, T> | undefined
    onLoad?: ExpandedReactEventHandler<A, T> | undefined
    onLoadCapture?: ExpandedReactEventHandler<A, T> | undefined
    onError?: ExpandedReactEventHandler<A, T> | undefined; // also a Media Even
    onErrorCapture?: ExpandedReactEventHandler<A, T> | undefined; // also a Media Even
    onKeyDown?: ExpandedKeyboardEventHandler<A, T> | undefined
    onKeyDownCapture?: ExpandedKeyboardEventHandler<A, T> | undefined
    onKeyPressCapture?: ExpandedKeyboardEventHandler<A, T> | undefined
    onKeyUp?: ExpandedKeyboardEventHandler<A, T> | undefined
    onKeyUpCapture?: ExpandedKeyboardEventHandler<A, T> | undefined
    onAbort?: ExpandedReactEventHandler<A, T> | undefined
    onAbortCapture?: ExpandedReactEventHandler<A, T> | undefined
    onCanPlay?: ExpandedReactEventHandler<A, T> | undefined
    onCanPlayCapture?: ExpandedReactEventHandler<A, T> | undefined
    onCanPlayThrough?: ExpandedReactEventHandler<A, T> | undefined
    onCanPlayThroughCapture?: ExpandedReactEventHandler<A, T> | undefined
    onDurationChange?: ExpandedReactEventHandler<A, T> | undefined
    onDurationChangeCapture?: ExpandedReactEventHandler<A, T> | undefined
    onEmptied?: ExpandedReactEventHandler<A, T> | undefined
    onEmptiedCapture?: ExpandedReactEventHandler<A, T> | undefined
    onEncrypted?: ExpandedReactEventHandler<A, T> | undefined
    onEncryptedCapture?: ExpandedReactEventHandler<A, T> | undefined
    onEnded?: ExpandedReactEventHandler<A, T> | undefined
    onEndedCapture?: ExpandedReactEventHandler<A, T> | undefined
    onLoadedData?: ExpandedReactEventHandler<A, T> | undefined
    onLoadedDataCapture?: ExpandedReactEventHandler<A, T> | undefined
    onLoadedMetadata?: ExpandedReactEventHandler<A, T> | undefined
    onLoadedMetadataCapture?: ExpandedReactEventHandler<A, T> | undefined
    onLoadStart?: ExpandedReactEventHandler<A, T> | undefined
    onLoadStartCapture?: ExpandedReactEventHandler<A, T> | undefined
    onPause?: ExpandedReactEventHandler<A, T> | undefined
    onPauseCapture?: ExpandedReactEventHandler<A, T> | undefined
    onPlay?: ExpandedReactEventHandler<A, T> | undefined
    onPlayCapture?: ExpandedReactEventHandler<A, T> | undefined
    onPlaying?: ExpandedReactEventHandler<A, T> | undefined
    onPlayingCapture?: ExpandedReactEventHandler<A, T> | undefined
    onProgress?: ExpandedReactEventHandler<A, T> | undefined
    onProgressCapture?: ExpandedReactEventHandler<A, T> | undefined
    onRateChange?: ExpandedReactEventHandler<A, T> | undefined
    onRateChangeCapture?: ExpandedReactEventHandler<A, T> | undefined
    onSeeked?: ExpandedReactEventHandler<A, T> | undefined
    onSeekedCapture?: ExpandedReactEventHandler<A, T> | undefined
    onSeeking?: ExpandedReactEventHandler<A, T> | undefined
    onSeekingCapture?: ExpandedReactEventHandler<A, T> | undefined
    onStalled?: ExpandedReactEventHandler<A, T> | undefined
    onStalledCapture?: ExpandedReactEventHandler<A, T> | undefined
    onSuspend?: ExpandedReactEventHandler<A, T> | undefined
    onSuspendCapture?: ExpandedReactEventHandler<A, T> | undefined
    onTimeUpdate?: ExpandedReactEventHandler<A, T> | undefined
    onTimeUpdateCapture?: ExpandedReactEventHandler<A, T> | undefined
    onVolumeChange?: ExpandedReactEventHandler<A, T> | undefined
    onVolumeChangeCapture?: ExpandedReactEventHandler<A, T> | undefined
    onWaiting?: ExpandedReactEventHandler<A, T> | undefined
    onWaitingCapture?: ExpandedReactEventHandler<A, T> | undefined
    onAuxClick?: ExpandedMouseEventHandler<A, T> | undefined
    onAuxClickCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onClick?: ExpandedMouseEventHandler<A, T> | undefined
    onClickCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onContextMenu?: ExpandedMouseEventHandler<A, T> | undefined
    onContextMenuCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onDoubleClick?: ExpandedMouseEventHandler<A, T> | undefined
    onDoubleClickCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onDrag?: ExpandedDragEventHandler<A, T> | undefined
    onDragCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDragEnd?: ExpandedDragEventHandler<A, T> | undefined
    onDragEndCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDragEnter?: ExpandedDragEventHandler<A, T> | undefined
    onDragEnterCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDragExit?: ExpandedDragEventHandler<A, T> | undefined
    onDragExitCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDragLeave?: ExpandedDragEventHandler<A, T> | undefined
    onDragLeaveCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDragOver?: ExpandedDragEventHandler<A, T> | undefined
    onDragOverCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDragStart?: ExpandedDragEventHandler<A, T> | undefined
    onDragStartCapture?: ExpandedDragEventHandler<A, T> | undefined
    onDrop?: ExpandedDragEventHandler<A, T> | undefined
    onDropCapture?: ExpandedDragEventHandler<A, T> | undefined
    onMouseDown?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseDownCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseEnter?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseLeave?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseMove?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseMoveCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseOut?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseOutCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseOver?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseOverCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseUp?: ExpandedMouseEventHandler<A, T> | undefined
    onMouseUpCapture?: ExpandedMouseEventHandler<A, T> | undefined
    onSelect?: ExpandedReactEventHandler<A, T> | undefined
    onSelectCapture?: ExpandedReactEventHandler<A, T> | undefined
    onTouchCancel?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchCancelCapture?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchEnd?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchEndCapture?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchMove?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchMoveCapture?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchStart?: ExpandedTouchEventHandler<A, T> | undefined
    onTouchStartCapture?: ExpandedTouchEventHandler<A, T> | undefined
    onPointerDown?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerDownCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerMove?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerMoveCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerUp?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerUpCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerCancel?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerCancelCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerEnter?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerEnterCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerLeave?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerLeaveCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerOver?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerOverCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerOut?: ExpandedPointerEventHandler<A, T> | undefined
    onPointerOutCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onGotPointerCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onGotPointerCaptureCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onLostPointerCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onLostPointerCaptureCapture?: ExpandedPointerEventHandler<A, T> | undefined
    onScroll?: ExpandedUIEventHandler<A, T> | undefined
    onScrollCapture?: ExpandedUIEventHandler<A, T> | undefined
    onWheel?: ExpandedWheelEventHandler<A, T> | undefined
    onWheelCapture?: ExpandedWheelEventHandler<A, T> | undefined
    onAnimationStart?: ExpandedAnimationEventHandler<A, T> | undefined
    onAnimationStartCapture?: ExpandedAnimationEventHandler<A, T> | undefined
    onAnimationEnd?: ExpandedAnimationEventHandler<A, T> | undefined
    onAnimationEndCapture?: ExpandedAnimationEventHandler<A, T> | undefined
    onAnimationIteration?: ExpandedAnimationEventHandler<A, T> | undefined
    onAnimationIterationCapture?: ExpandedAnimationEventHandler<A, T> | undefined
    onTransitionEnd?: ExpandedTransitionEventHandler<A, T> | undefined
    onTransitionEndCapture?: ExpandedTransitionEventHandler<A, T> | undefined
}

export const withExpandedEventHandlers = function <A extends any[], T, P extends React.DOMAttributes<T>> (
    Component: (props: P) => React.ReactElement,
    ...expandedArgs: A
) {
    return (props: P & ExpandedEventHandlers<A, T>) => (
        <Component {...props}
            onCopy={(event) => { typeof props.onCopy === 'function' && props.onCopy(event, ...expandedArgs) }}
            onCopyCapture={(event) => { typeof props.onCopyCapture === 'function' && props.onCopyCapture(event, ...expandedArgs) }}
            onCut={(event) => { typeof props.onCut === 'function' && props.onCut(event, ...expandedArgs) }}
            onCutCapture={(event) => { typeof props.onCutCapture === 'function' && props.onCutCapture(event, ...expandedArgs) }}
            onPaste={(event) => { typeof props.onPaste === 'function' && props.onPaste(event, ...expandedArgs) }}
            onPasteCapture={(event) => { typeof props.onPasteCapture === 'function' && props.onPasteCapture(event, ...expandedArgs) }}
            onCompositionEnd={(event) => { typeof props.onCompositionEnd === 'function' && props.onCompositionEnd(event, ...expandedArgs) }}
            onCompositionEndCapture={(event) => { typeof props.onCompositionEndCapture === 'function' && props.onCompositionEndCapture(event, ...expandedArgs) }}
            onCompositionStart={(event) => { typeof props.onCompositionStart === 'function' && props.onCompositionStart(event, ...expandedArgs) }}
            onCompositionStartCapture={(event) => { typeof props.onCompositionStartCapture === 'function' && props.onCompositionStartCapture(event, ...expandedArgs) }}
            onCompositionUpdate={(event) => { typeof props.onCompositionUpdate === 'function' && props.onCompositionUpdate(event, ...expandedArgs) }}
            onCompositionUpdateCapture={(event) => { typeof props.onCompositionUpdateCapture === 'function' && props.onCompositionUpdateCapture(event, ...expandedArgs) }}
            onFocus={(event) => { typeof props.onFocus === 'function' && props.onFocus(event, ...expandedArgs) }}
            onFocusCapture={(event) => { typeof props.onFocusCapture === 'function' && props.onFocusCapture(event, ...expandedArgs) }}
            onBlur={(event) => { typeof props.onBlur === 'function' && props.onBlur(event, ...expandedArgs) }}
            onBlurCapture={(event) => { typeof props.onBlurCapture === 'function' && props.onBlurCapture(event, ...expandedArgs) }}
            onChange={(event) => { typeof props.onChange === 'function' && props.onChange(event, ...expandedArgs) }}
            onChangeCapture={(event) => { typeof props.onChangeCapture === 'function' && props.onChangeCapture(event, ...expandedArgs) }}
            onBeforeInput={(event) => { typeof props.onBeforeInput === 'function' && props.onBeforeInput(event, ...expandedArgs) }}
            onBeforeInputCapture={(event) => { typeof props.onBeforeInputCapture === 'function' && props.onBeforeInputCapture(event, ...expandedArgs) }}
            onInput={(event) => { typeof props.onInput === 'function' && props.onInput(event, ...expandedArgs) }}
            onInputCapture={(event) => { typeof props.onInputCapture === 'function' && props.onInputCapture(event, ...expandedArgs) }}
            onReset={(event) => { typeof props.onReset === 'function' && props.onReset(event, ...expandedArgs) }}
            onResetCapture={(event) => { typeof props.onResetCapture === 'function' && props.onResetCapture(event, ...expandedArgs) }}
            onSubmit={(event) => { typeof props.onSubmit === 'function' && props.onSubmit(event, ...expandedArgs) }}
            onSubmitCapture={(event) => { typeof props.onSubmitCapture === 'function' && props.onSubmitCapture(event, ...expandedArgs) }}
            onInvalid={(event) => { typeof props.onInvalid === 'function' && props.onInvalid(event, ...expandedArgs) }}
            onInvalidCapture={(event) => { typeof props.onInvalidCapture === 'function' && props.onInvalidCapture(event, ...expandedArgs) }}
            onLoad={(event) => { typeof props.onLoad === 'function' && props.onLoad(event, ...expandedArgs) }}
            onLoadCapture={(event) => { typeof props.onLoadCapture === 'function' && props.onLoadCapture(event, ...expandedArgs) }}
            onError={(event) => { typeof props.onError === 'function' && props.onError(event, ...expandedArgs) }}
            onErrorCapture={(event) => { typeof props.onErrorCapture === 'function' && props.onErrorCapture(event, ...expandedArgs) }}
            onKeyDown={(event) => { typeof props.onKeyDown === 'function' && props.onKeyDown(event, ...expandedArgs) }}
            onKeyDownCapture={(event) => { typeof props.onKeyDownCapture === 'function' && props.onKeyDownCapture(event, ...expandedArgs) }}
            onKeyPressCapture={(event) => { typeof props.onKeyPressCapture === 'function' && props.onKeyPressCapture(event, ...expandedArgs) }}
            onKeyUp={(event) => { typeof props.onKeyUp === 'function' && props.onKeyUp(event, ...expandedArgs) }}
            onKeyUpCapture={(event) => { typeof props.onKeyUpCapture === 'function' && props.onKeyUpCapture(event, ...expandedArgs) }}
            onAbort={(event) => { typeof props.onAbort === 'function' && props.onAbort(event, ...expandedArgs) }}
            onAbortCapture={(event) => { typeof props.onAbortCapture === 'function' && props.onAbortCapture(event, ...expandedArgs) }}
            onCanPlay={(event) => { typeof props.onCanPlay === 'function' && props.onCanPlay(event, ...expandedArgs) }}
            onCanPlayCapture={(event) => { typeof props.onCanPlayCapture === 'function' && props.onCanPlayCapture(event, ...expandedArgs) }}
            onCanPlayThrough={(event) => { typeof props.onCanPlayThrough === 'function' && props.onCanPlayThrough(event, ...expandedArgs) }}
            onCanPlayThroughCapture={(event) => { typeof props.onCanPlayThroughCapture === 'function' && props.onCanPlayThroughCapture(event, ...expandedArgs) }}
            onDurationChange={(event) => { typeof props.onDurationChange === 'function' && props.onDurationChange(event, ...expandedArgs) }}
            onDurationChangeCapture={(event) => { typeof props.onDurationChangeCapture === 'function' && props.onDurationChangeCapture(event, ...expandedArgs) }}
            onEmptied={(event) => { typeof props.onEmptied === 'function' && props.onEmptied(event, ...expandedArgs) }}
            onEmptiedCapture={(event) => { typeof props.onEmptiedCapture === 'function' && props.onEmptiedCapture(event, ...expandedArgs) }}
            onEncrypted={(event) => { typeof props.onEncrypted === 'function' && props.onEncrypted(event, ...expandedArgs) }}
            onEncryptedCapture={(event) => { typeof props.onEncryptedCapture === 'function' && props.onEncryptedCapture(event, ...expandedArgs) }}
            onEnded={(event) => { typeof props.onEnded === 'function' && props.onEnded(event, ...expandedArgs) }}
            onEndedCapture={(event) => { typeof props.onEndedCapture === 'function' && props.onEndedCapture(event, ...expandedArgs) }}
            onLoadedData={(event) => { typeof props.onLoadedData === 'function' && props.onLoadedData(event, ...expandedArgs) }}
            onLoadedDataCapture={(event) => { typeof props.onLoadedDataCapture === 'function' && props.onLoadedDataCapture(event, ...expandedArgs) }}
            onLoadedMetadata={(event) => { typeof props.onLoadedMetadata === 'function' && props.onLoadedMetadata(event, ...expandedArgs) }}
            onLoadedMetadataCapture={(event) => { typeof props.onLoadedMetadataCapture === 'function' && props.onLoadedMetadataCapture(event, ...expandedArgs) }}
            onLoadStart={(event) => { typeof props.onLoadStart === 'function' && props.onLoadStart(event, ...expandedArgs) }}
            onLoadStartCapture={(event) => { typeof props.onLoadStartCapture === 'function' && props.onLoadStartCapture(event, ...expandedArgs) }}
            onPause={(event) => { typeof props.onPause === 'function' && props.onPause(event, ...expandedArgs) }}
            onPauseCapture={(event) => { typeof props.onPauseCapture === 'function' && props.onPauseCapture(event, ...expandedArgs) }}
            onPlay={(event) => { typeof props.onPlay === 'function' && props.onPlay(event, ...expandedArgs) }}
            onPlayCapture={(event) => { typeof props.onPlayCapture === 'function' && props.onPlayCapture(event, ...expandedArgs) }}
            onPlaying={(event) => { typeof props.onPlaying === 'function' && props.onPlaying(event, ...expandedArgs) }}
            onPlayingCapture={(event) => { typeof props.onPlayingCapture === 'function' && props.onPlayingCapture(event, ...expandedArgs) }}
            onProgress={(event) => { typeof props.onProgress === 'function' && props.onProgress(event, ...expandedArgs) }}
            onProgressCapture={(event) => { typeof props.onProgressCapture === 'function' && props.onProgressCapture(event, ...expandedArgs) }}
            onRateChange={(event) => { typeof props.onRateChange === 'function' && props.onRateChange(event, ...expandedArgs) }}
            onRateChangeCapture={(event) => { typeof props.onRateChangeCapture === 'function' && props.onRateChangeCapture(event, ...expandedArgs) }}
            onSeeked={(event) => { typeof props.onSeeked === 'function' && props.onSeeked(event, ...expandedArgs) }}
            onSeekedCapture={(event) => { typeof props.onSeekedCapture === 'function' && props.onSeekedCapture(event, ...expandedArgs) }}
            onSeeking={(event) => { typeof props.onSeeking === 'function' && props.onSeeking(event, ...expandedArgs) }}
            onSeekingCapture={(event) => { typeof props.onSeekingCapture === 'function' && props.onSeekingCapture(event, ...expandedArgs) }}
            onStalled={(event) => { typeof props.onStalled === 'function' && props.onStalled(event, ...expandedArgs) }}
            onStalledCapture={(event) => { typeof props.onStalledCapture === 'function' && props.onStalledCapture(event, ...expandedArgs) }}
            onSuspend={(event) => { typeof props.onSuspend === 'function' && props.onSuspend(event, ...expandedArgs) }}
            onSuspendCapture={(event) => { typeof props.onSuspendCapture === 'function' && props.onSuspendCapture(event, ...expandedArgs) }}
            onTimeUpdate={(event) => { typeof props.onTimeUpdate === 'function' && props.onTimeUpdate(event, ...expandedArgs) }}
            onTimeUpdateCapture={(event) => { typeof props.onTimeUpdateCapture === 'function' && props.onTimeUpdateCapture(event, ...expandedArgs) }}
            onVolumeChange={(event) => { typeof props.onVolumeChange === 'function' && props.onVolumeChange(event, ...expandedArgs) }}
            onVolumeChangeCapture={(event) => { typeof props.onVolumeChangeCapture === 'function' && props.onVolumeChangeCapture(event, ...expandedArgs) }}
            onWaiting={(event) => { typeof props.onWaiting === 'function' && props.onWaiting(event, ...expandedArgs) }}
            onWaitingCapture={(event) => { typeof props.onWaitingCapture === 'function' && props.onWaitingCapture(event, ...expandedArgs) }}
            onAuxClick={(event) => { typeof props.onAuxClick === 'function' && props.onAuxClick(event, ...expandedArgs) }}
            onAuxClickCapture={(event) => { typeof props.onAuxClickCapture === 'function' && props.onAuxClickCapture(event, ...expandedArgs) }}
            onClick={(event) => { typeof props.onClick === 'function' && props.onClick(event, ...expandedArgs) }}
            onClickCapture={(event) => { typeof props.onClickCapture === 'function' && props.onClickCapture(event, ...expandedArgs) }}
            onContextMenu={(event) => { typeof props.onContextMenu === 'function' && props.onContextMenu(event, ...expandedArgs) }}
            onContextMenuCapture={(event) => { typeof props.onContextMenuCapture === 'function' && props.onContextMenuCapture(event, ...expandedArgs) }}
            onDoubleClick={(event) => { typeof props.onDoubleClick === 'function' && props.onDoubleClick(event, ...expandedArgs) }}
            onDoubleClickCapture={(event) => { typeof props.onDoubleClickCapture === 'function' && props.onDoubleClickCapture(event, ...expandedArgs) }}
            onDrag={(event) => { typeof props.onDrag === 'function' && props.onDrag(event, ...expandedArgs) }}
            onDragCapture={(event) => { typeof props.onDragCapture === 'function' && props.onDragCapture(event, ...expandedArgs) }}
            onDragEnd={(event) => { typeof props.onDragEnd === 'function' && props.onDragEnd(event, ...expandedArgs) }}
            onDragEndCapture={(event) => { typeof props.onDragEndCapture === 'function' && props.onDragEndCapture(event, ...expandedArgs) }}
            onDragEnter={(event) => { typeof props.onDragEnter === 'function' && props.onDragEnter(event, ...expandedArgs) }}
            onDragEnterCapture={(event) => { typeof props.onDragEnterCapture === 'function' && props.onDragEnterCapture(event, ...expandedArgs) }}
            onDragExit={(event) => { typeof props.onDragExit === 'function' && props.onDragExit(event, ...expandedArgs) }}
            onDragExitCapture={(event) => { typeof props.onDragExitCapture === 'function' && props.onDragExitCapture(event, ...expandedArgs) }}
            onDragLeave={(event) => { typeof props.onDragLeave === 'function' && props.onDragLeave(event, ...expandedArgs) }}
            onDragLeaveCapture={(event) => { typeof props.onDragLeaveCapture === 'function' && props.onDragLeaveCapture(event, ...expandedArgs) }}
            onDragOver={(event) => { typeof props.onDragOver === 'function' && props.onDragOver(event, ...expandedArgs) }}
            onDragOverCapture={(event) => { typeof props.onDragOverCapture === 'function' && props.onDragOverCapture(event, ...expandedArgs) }}
            onDragStart={(event) => { typeof props.onDragStart === 'function' && props.onDragStart(event, ...expandedArgs) }}
            onDragStartCapture={(event) => { typeof props.onDragStartCapture === 'function' && props.onDragStartCapture(event, ...expandedArgs) }}
            onDrop={(event) => { typeof props.onDrop === 'function' && props.onDrop(event, ...expandedArgs) }}
            onDropCapture={(event) => { typeof props.onDropCapture === 'function' && props.onDropCapture(event, ...expandedArgs) }}
            onMouseDown={(event) => { typeof props.onMouseDown === 'function' && props.onMouseDown(event, ...expandedArgs) }}
            onMouseDownCapture={(event) => { typeof props.onMouseDownCapture === 'function' && props.onMouseDownCapture(event, ...expandedArgs) }}
            onMouseEnter={(event) => { typeof props.onMouseEnter === 'function' && props.onMouseEnter(event, ...expandedArgs) }}
            onMouseLeave={(event) => { typeof props.onMouseLeave === 'function' && props.onMouseLeave(event, ...expandedArgs) }}
            onMouseMove={(event) => { typeof props.onMouseMove === 'function' && props.onMouseMove(event, ...expandedArgs) }}
            onMouseMoveCapture={(event) => { typeof props.onMouseMoveCapture === 'function' && props.onMouseMoveCapture(event, ...expandedArgs) }}
            onMouseOut={(event) => { typeof props.onMouseOut === 'function' && props.onMouseOut(event, ...expandedArgs) }}
            onMouseOutCapture={(event) => { typeof props.onMouseOutCapture === 'function' && props.onMouseOutCapture(event, ...expandedArgs) }}
            onMouseOver={(event) => { typeof props.onMouseOver === 'function' && props.onMouseOver(event, ...expandedArgs) }}
            onMouseOverCapture={(event) => { typeof props.onMouseOverCapture === 'function' && props.onMouseOverCapture(event, ...expandedArgs) }}
            onMouseUp={(event) => { typeof props.onMouseUp === 'function' && props.onMouseUp(event, ...expandedArgs) }}
            onMouseUpCapture={(event) => { typeof props.onMouseUpCapture === 'function' && props.onMouseUpCapture(event, ...expandedArgs) }}
            onSelect={(event) => { typeof props.onSelect === 'function' && props.onSelect(event, ...expandedArgs) }}
            onSelectCapture={(event) => { typeof props.onSelectCapture === 'function' && props.onSelectCapture(event, ...expandedArgs) }}
            onTouchCancel={(event) => { typeof props.onTouchCancel === 'function' && props.onTouchCancel(event, ...expandedArgs) }}
            onTouchCancelCapture={(event) => { typeof props.onTouchCancelCapture === 'function' && props.onTouchCancelCapture(event, ...expandedArgs) }}
            onTouchEnd={(event) => { typeof props.onTouchEnd === 'function' && props.onTouchEnd(event, ...expandedArgs) }}
            onTouchEndCapture={(event) => { typeof props.onTouchEndCapture === 'function' && props.onTouchEndCapture(event, ...expandedArgs) }}
            onTouchMove={(event) => { typeof props.onTouchMove === 'function' && props.onTouchMove(event, ...expandedArgs) }}
            onTouchMoveCapture={(event) => { typeof props.onTouchMoveCapture === 'function' && props.onTouchMoveCapture(event, ...expandedArgs) }}
            onTouchStart={(event) => { typeof props.onTouchStart === 'function' && props.onTouchStart(event, ...expandedArgs) }}
            onTouchStartCapture={(event) => { typeof props.onTouchStartCapture === 'function' && props.onTouchStartCapture(event, ...expandedArgs) }}
            onPointerDown={(event) => { typeof props.onPointerDown === 'function' && props.onPointerDown(event, ...expandedArgs) }}
            onPointerDownCapture={(event) => { typeof props.onPointerDownCapture === 'function' && props.onPointerDownCapture(event, ...expandedArgs) }}
            onPointerMove={(event) => { typeof props.onPointerMove === 'function' && props.onPointerMove(event, ...expandedArgs) }}
            onPointerMoveCapture={(event) => { typeof props.onPointerMoveCapture === 'function' && props.onPointerMoveCapture(event, ...expandedArgs) }}
            onPointerUp={(event) => { typeof props.onPointerUp === 'function' && props.onPointerUp(event, ...expandedArgs) }}
            onPointerUpCapture={(event) => { typeof props.onPointerUpCapture === 'function' && props.onPointerUpCapture(event, ...expandedArgs) }}
            onPointerCancel={(event) => { typeof props.onPointerCancel === 'function' && props.onPointerCancel(event, ...expandedArgs) }}
            onPointerCancelCapture={(event) => { typeof props.onPointerCancelCapture === 'function' && props.onPointerCancelCapture(event, ...expandedArgs) }}
            onPointerEnter={(event) => { typeof props.onPointerEnter === 'function' && props.onPointerEnter(event, ...expandedArgs) }}
            onPointerEnterCapture={(event) => { typeof props.onPointerEnterCapture === 'function' && props.onPointerEnterCapture(event, ...expandedArgs) }}
            onPointerLeave={(event) => { typeof props.onPointerLeave === 'function' && props.onPointerLeave(event, ...expandedArgs) }}
            onPointerLeaveCapture={(event) => { typeof props.onPointerLeaveCapture === 'function' && props.onPointerLeaveCapture(event, ...expandedArgs) }}
            onPointerOver={(event) => { typeof props.onPointerOver === 'function' && props.onPointerOver(event, ...expandedArgs) }}
            onPointerOverCapture={(event) => { typeof props.onPointerOverCapture === 'function' && props.onPointerOverCapture(event, ...expandedArgs) }}
            onPointerOut={(event) => { typeof props.onPointerOut === 'function' && props.onPointerOut(event, ...expandedArgs) }}
            onPointerOutCapture={(event) => { typeof props.onPointerOutCapture === 'function' && props.onPointerOutCapture(event, ...expandedArgs) }}
            onGotPointerCapture={(event) => { typeof props.onGotPointerCapture === 'function' && props.onGotPointerCapture(event, ...expandedArgs) }}
            onGotPointerCaptureCapture={(event) => { typeof props.onGotPointerCaptureCapture === 'function' && props.onGotPointerCaptureCapture(event, ...expandedArgs) }}
            onLostPointerCapture={(event) => { typeof props.onLostPointerCapture === 'function' && props.onLostPointerCapture(event, ...expandedArgs) }}
            onLostPointerCaptureCapture={(event) => { typeof props.onLostPointerCaptureCapture === 'function' && props.onLostPointerCaptureCapture(event, ...expandedArgs) }}
            onScroll={(event) => { typeof props.onScroll === 'function' && props.onScroll(event, ...expandedArgs) }}
            onScrollCapture={(event) => { typeof props.onScrollCapture === 'function' && props.onScrollCapture(event, ...expandedArgs) }}
            onWheel={(event) => { typeof props.onWheel === 'function' && props.onWheel(event, ...expandedArgs) }}
            onWheelCapture={(event) => { typeof props.onWheelCapture === 'function' && props.onWheelCapture(event, ...expandedArgs) }}
            onAnimationStart={(event) => { typeof props.onAnimationStart === 'function' && props.onAnimationStart(event, ...expandedArgs) }}
            onAnimationStartCapture={(event) => { typeof props.onAnimationStartCapture === 'function' && props.onAnimationStartCapture(event, ...expandedArgs) }}
            onAnimationEnd={(event) => { typeof props.onAnimationEnd === 'function' && props.onAnimationEnd(event, ...expandedArgs) }}
            onAnimationEndCapture={(event) => { typeof props.onAnimationEndCapture === 'function' && props.onAnimationEndCapture(event, ...expandedArgs) }}
            onAnimationIteration={(event) => { typeof props.onAnimationIteration === 'function' && props.onAnimationIteration(event, ...expandedArgs) }}
            onAnimationIterationCapture={(event) => { typeof props.onAnimationIterationCapture === 'function' && props.onAnimationIterationCapture(event, ...expandedArgs) }}
            onTransitionEnd={(event) => { typeof props.onTransitionEnd === 'function' && props.onTransitionEnd(event, ...expandedArgs) }}
            onTransitionEndCapture={(event) => { typeof props.onTransitionEndCapture === 'function' && props.onTransitionEndCapture(event, ...expandedArgs) }}
        />
    )
}