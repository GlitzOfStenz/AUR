from fastapi import APIRouter, Query, HTTPException

from schemas import CompareResponse

router = APIRouter(prefix="/api/compare", tags=["Compare"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/", response_model=CompareResponse)
def compare_universities(
    ids: str = Query(..., description="Comma separated university IDs e.g. nus,iit-bombay,tsinghua")
):
    data = get_data()
    
    # Split the IDs
    id_list = [i.strip() for i in ids.split(",")]
    
    if len(id_list) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 university IDs")
    
    if len(id_list) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 universities can be compared at once")
    
    # Find each university
    results = []
    not_found = []
    
    for uni_id in id_list:
        uni = next((u for u in data if u["id"] == uni_id), None)
        if uni:
            results.append(uni)
        else:
            not_found.append(uni_id)
    
    if not_found:
        raise HTTPException(status_code=404, detail=f"Universities not found: {', '.join(not_found)}")
    
    return {
        "count": len(results),
        "universities": results
    }