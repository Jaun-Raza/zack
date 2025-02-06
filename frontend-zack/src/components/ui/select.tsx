import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import styled from "styled-components";

const StyledSelectTrigger = styled(SelectPrimitive.Trigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  box-shadow: 0px 0px 5px 7px rgba(90, 13, 100, 0.77);
  border-radius: 0.5rem 0.5rem 0 0; 
  outline: none;
  color: #fff;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
    font-size: 1rem;
  }

  img {
    width: 30px;
  }
`;

const StyledSelectIcon = styled(ChevronDown)`
  height: 1rem;
  width: 1rem;
  opacity: 0.5;
`;

const StyledSelectScrollButton = styled.div`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
`;

const StyledSelectContent = styled(SelectPrimitive.Content)`
  position: relative;
  z-index: 50;
  max-height: 24rem;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 5px 7px rgba(90, 13, 100, 0.77);
  border-radius: 0 0 0.5rem 0.5rem; 
  color: #fff;;
  &[data-state="open"] {
    animation: fadeIn 0.2s ease-out;
  }
  &[data-state="closed"] {
    animation: fadeOut 0.2s ease-out;
  }
  &[data-side="bottom"] {
    transform: translateY(0.25rem);
  }
  &[data-side="left"] {
    transform: translateX(-0.25rem);
  }
  &[data-side="right"] {
    transform: translateX(0.25rem);
  }
  &[data-side="top"] {
    transform: translateY(-0.25rem);
  }

  
`;

const StyledSelectViewport = styled(SelectPrimitive.Viewport)`
  padding: 0.25rem;
  &[data-position="popper"] {
    height: var(--radix-select-trigger-height);
    width: 100%;
    min-width: var(--radix-select-trigger-width);
  }
`;

const StyledSelectLabel = styled(SelectPrimitive.Label)`
  padding: 0.375rem 0.5rem 0.375rem 2rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const StyledSelectItem = styled(SelectPrimitive.Item)`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem 0.375rem 0git initrem;
  font-size: 0.875rem;
  outline: none;
  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  img {
    width: 30px;
  }

  span {
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
  }
`;

const StyledSelectItemIndicator = styled(SelectPrimitive.ItemIndicator)`
  position: absolute;
  left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1rem;
  width: 1rem;
`;

const StyledSelectSeparator = styled(SelectPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: var(--muted);
`;

// Components
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <StyledSelectTrigger ref={ref} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <StyledSelectIcon />
    </SelectPrimitive.Icon>
  </StyledSelectTrigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>((props, ref) => (
  <StyledSelectScrollButton ref={ref} {...props}>
    <ChevronUp className="h-4 w-4" />
  </StyledSelectScrollButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>((props, ref) => (
  <StyledSelectScrollButton ref={ref} {...props}>
    <ChevronDown className="h-4 w-4" />
  </StyledSelectScrollButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <StyledSelectContent ref={ref} position={position} {...props}>

      <StyledSelectViewport>{children}</StyledSelectViewport>

    </StyledSelectContent>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>((props, ref) => <StyledSelectLabel ref={ref} {...props} />);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, ...props }, ref) => (
  <StyledSelectItem ref={ref} {...props}>
    <StyledSelectItemIndicator>
      <Check className="h-4 w-4" />
    </StyledSelectItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </StyledSelectItem>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>((props, ref) => <StyledSelectSeparator ref={ref} {...props} />);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};