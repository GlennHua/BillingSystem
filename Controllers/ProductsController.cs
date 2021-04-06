using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BillSystem.Models;

namespace BillSystem.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ProductsController : Controller
    {
        private readonly BillContext _context;

        public ProductsController(BillContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetBills()
        {
            var bills = _context.Bills.ToList();
            var billsForReturning = new List<BillViewModel>();

            foreach (var bill in bills)
            {
                var theBill = new BillViewModel
                {
                    BillId = bill.Id,
                    Customer = await _context.Customers.SingleOrDefaultAsync(x => x.Id == bill.CustId),
                    Details = _context.Billdetails.ToList().FindAll(x => x.BillId == bill.Id),
                    TotalPrice = 0                 
                };

                theBill.TotalPrice = getTotalPrice(theBill.Details);

                billsForReturning.Add(theBill);
            }

            return Json(new { isSuccess = true, bills=billsForReturning });

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            if (id>0)
            {
                var bill = _context.Bills.FirstOrDefault(x => x.Id == id);

                _context.Bills.Remove(bill);
                await _context.SaveChangesAsync();

                return Json(new { isSuccess = true, Message = "Bill has been deleted" });
            }
            else
            {
                return Json(new { isSuccess = false, Message = "Invalid ID" });
            }
        }


        public int getTotalPrice(List<Billdetail> list)
        {
            int totalPrice = 0;

            foreach(var item in list)
            {
                totalPrice = totalPrice + (item.Quantity) * (item.UnitPrice);
            }
            return totalPrice;
        }


        [HttpPost("{Custid}")]
        public IActionResult CreateBill(int CustId, [FromBody]List<Billdetail> detailsList)
        {
            if (CustId != 0)
            {
                try
                {
                    var bill = new Bill { CustId=CustId };
                    _context.Add(bill);
                    _context.SaveChanges();

                    var currentBill = _context.Bills.ToList().Last();

                    try
                    {
                        foreach (var obj in detailsList)
                        {
                            var newBillDetail = new Billdetail
                            {
                                BillId = currentBill.Id,
                                ProdId = obj.ProdId,
                                Quantity = obj.Quantity,
                                UnitPrice = obj.UnitPrice
                            };
                            _context.Billdetails.Add(newBillDetail);
                            _context.SaveChanges();
                        }
                        

                        return Json(new { isSuccess = true, Message = "Bill has been created" });
                    }
                    catch (Exception e)
                    {

                        return Json(new { isSuccess = false, Message = e.Message, position=1, detailsList });
                    }
                    
                }
                catch (Exception e)
                {
                    return Json(new { isSuccess = false, Message = e.Message, position = 2 });
                }
            }
            else
            {
                return Json(new { isSuccess = false, Message = "Invalid Customer Id", position = 3 });
            }
        }













        // GET: Products
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }


        



        // GET: Products/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var product = await _context.Products
                .FirstOrDefaultAsync(m => m.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // GET: Products/Create
        public IActionResult Create()
        {
            return View();
        }


        // POST: Products/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Create([Bind("Id,Price,Name")] Product product)
        public async Task<IActionResult> Create([FromBody]Product product)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    //return Json(new { isSuccess=false, Message="Invalid model state" });
                    return BadRequest(ModelState);
                }
                _context.Add(product);
                await _context.SaveChangesAsync();
                return Json(new { isSuccess=true, Message="New product has been added" });

            }
            catch (Exception e)
            {
                return Json(new { isSuccess = false, Message = e.Message });
            }
            
        }



        // GET: Products/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return View(product);
        }

        // POST: Products/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPut]
        //public async Task<IActionResult> Edit(int id, [Bind("Id,Price,Name")] Product product)
        public async Task<IActionResult> Edit([Bind("Id,Price,Name")] [FromBody]Product product)
        {
            //if (id != product.Id)
            //{
            //    return NotFound();
            //}

            if (ModelState.IsValid)
            {
                try
                {
                    var theProduct = _context.Products.SingleOrDefault(x => x.Id == product.Id);

                    if (theProduct == null) return Json(new { isSuccess = false, Message = "Cannot find this row" }); ;

                    theProduct.Name = product.Name;
                    theProduct.Price = product.Price;

                    _context.Update(theProduct);

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProductExists(product.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return Json(new { isSuccess = true, Message = "New product has been added" });
        }

        // GET: Products/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            //if (id == null)
            //{
            //    return NotFound();
            //}

            var product = await _context.Products
                .FirstOrDefaultAsync(m => m.Id == id);

            if (product == null)
            {
                return Json(new { isSuccess=false, Message="Faild to find this record" });
            }
            else 
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return Json(new { isSuccess=true, Message="Deleted" });
            }

        }

        // POST: Products/Delete/5
        
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products.FindAsync(id);
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
