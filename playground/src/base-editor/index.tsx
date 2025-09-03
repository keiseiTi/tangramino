import { FlowLayoutProvider, Draggable, DragOverlay } from '@tangramino/base-editor';
import materials from './materials';
export default function App() {
  return (
    <FlowLayoutProvider>
      <div className='flex w-screen h-screen min-w-[980px] overflow-auto'>
        <div className='w-62 border-r-1 border-gray-200 h-full p-4'>
          {materials.map((item) => (
            <Draggable
              data={item}
              key={item.type}
              className='w-full mb-2 h-8 text-sm flex justify-center items-center rounded-sm border border-slate-600 cursor-pointer hover:bg-zinc-50'
            >
              <span className='text-sm'>{item.title}</span>
            </Draggable>
          ))}
        </div>
        <div className='flex-1'>editor</div>

        <DragOverlay>
          <div className='w-full p-1 text-xs flex justify-center items-center rounded-sm border border-slate-600 bg-[#fafafabf] cursor-copy'>
            <span className='text-store-600'>abc</span>
          </div>
        </DragOverlay>
      </div>
    </FlowLayoutProvider>
  );
}
